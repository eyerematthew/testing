// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint64, euint32, ebool, eaddress, externalEuint64, externalEuint32, externalEbool} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract OTCMarketplace is SepoliaConfig {

    struct EncryptedOrder {
        uint256 orderId;
        address owner;
        address assetAddress;
        euint64 amount;
        euint64 price;
        euint64 filledAmount;
        ebool isActive;
        euint64 minFillAmount;
        uint256 expirationTime;
        bool isBuyOrder;
        uint256 createdAt;
    }

    struct EncryptedMatch {
        uint256 matchId;
        uint256 buyOrderId;
        uint256 sellOrderId;
        euint64 matchedAmount;
        euint64 matchedPrice;
        ebool isSettled;
        uint256 timestamp;
        address buyer;
        address seller;
    }

    uint256 public orderCounter;
    uint256 public matchCounter;
    address public feeCollector;
    uint256 public feeBasisPoints;

    mapping(uint256 => EncryptedOrder) private orders;
    mapping(uint256 => EncryptedMatch) private matches;
    mapping(address => mapping(address => euint64)) private tokenBalances;
    mapping(address => uint256[]) private userOrders;
    mapping(address => uint256[]) private userMatches;

    event OrderCreated(uint256 indexed orderId, address indexed owner, address indexed asset, bool isBuy, uint256 timestamp);
    event OrderMatched(uint256 indexed matchId, uint256 indexed buyOrderId, uint256 indexed sellOrderId, uint256 timestamp);
    event OrderCancelled(uint256 indexed orderId, address indexed owner, uint256 timestamp);
    event SettlementExecuted(uint256 indexed matchId, uint256 timestamp);
    event Deposit(address indexed user, address indexed asset, uint256 timestamp);
    event Withdrawal(address indexed user, address indexed asset, uint256 timestamp);

    modifier onlyOrderOwner(uint256 orderId) {
        require(orders[orderId].owner == msg.sender, "NOT_OWNER");
        _;
    }

    modifier orderExists(uint256 orderId) {
        require(orderId < orderCounter, "ORDER_NOT_EXIST");
        _;
    }

    modifier validExpiration(uint256 expirationTime) {
        require(expirationTime > block.timestamp, "INVALID_EXPIRATION");
        _;
    }

    constructor(address _feeCollector, uint256 _feeBasisPoints) {
        require(_feeCollector != address(0), "INVALID_FEE_COLLECTOR");
        require(_feeBasisPoints <= 1000, "FEE_TOO_HIGH");
        feeCollector = _feeCollector;
        feeBasisPoints = _feeBasisPoints;
    }

    function createBuyOrder(
        address assetAddress,
        externalEuint64 amount,
        externalEuint64 price,
        externalEuint64 minFillAmount,
        bytes calldata inputProof,
        uint256 expirationTime
    ) external validExpiration(expirationTime) returns (uint256) {
        require(assetAddress != address(0), "INVALID_ASSET");

        euint64 _amount = FHE.fromExternal(amount, inputProof);
        euint64 _price = FHE.fromExternal(price, inputProof);
        euint64 _minFill = FHE.fromExternal(minFillAmount, inputProof);

        uint256 orderId = orderCounter++;

        orders[orderId] = EncryptedOrder({
            orderId: orderId,
            owner: msg.sender,
            assetAddress: assetAddress,
            amount: _amount,
            price: _price,
            filledAmount: FHE.asEuint64(0),
            isActive: FHE.asEbool(true),
            minFillAmount: _minFill,
            expirationTime: expirationTime,
            isBuyOrder: true,
            createdAt: block.timestamp
        });

        FHE.allow(orders[orderId].amount, msg.sender);
        FHE.allow(orders[orderId].price, msg.sender);
        FHE.allow(orders[orderId].filledAmount, msg.sender);
        FHE.allow(orders[orderId].isActive, msg.sender);
        FHE.allowThis(orders[orderId].amount);
        FHE.allowThis(orders[orderId].price);
        FHE.allowThis(orders[orderId].filledAmount);
        FHE.allowThis(orders[orderId].isActive);

        userOrders[msg.sender].push(orderId);

        emit OrderCreated(orderId, msg.sender, assetAddress, true, block.timestamp);
        return orderId;
    }

    function createSellOrder(
        address assetAddress,
        externalEuint64 amount,
        externalEuint64 price,
        externalEuint64 minFillAmount,
        bytes calldata inputProof,
        uint256 expirationTime
    ) external validExpiration(expirationTime) returns (uint256) {
        require(assetAddress != address(0), "INVALID_ASSET");

        euint64 _amount = FHE.fromExternal(amount, inputProof);
        euint64 _price = FHE.fromExternal(price, inputProof);
        euint64 _minFill = FHE.fromExternal(minFillAmount, inputProof);

        uint256 orderId = orderCounter++;

        orders[orderId] = EncryptedOrder({
            orderId: orderId,
            owner: msg.sender,
            assetAddress: assetAddress,
            amount: _amount,
            price: _price,
            filledAmount: FHE.asEuint64(0),
            isActive: FHE.asEbool(true),
            minFillAmount: _minFill,
            expirationTime: expirationTime,
            isBuyOrder: false,
            createdAt: block.timestamp
        });

        FHE.allow(orders[orderId].amount, msg.sender);
        FHE.allow(orders[orderId].price, msg.sender);
        FHE.allow(orders[orderId].filledAmount, msg.sender);
        FHE.allow(orders[orderId].isActive, msg.sender);
        FHE.allowThis(orders[orderId].amount);
        FHE.allowThis(orders[orderId].price);
        FHE.allowThis(orders[orderId].filledAmount);
        FHE.allowThis(orders[orderId].isActive);

        userOrders[msg.sender].push(orderId);

        emit OrderCreated(orderId, msg.sender, assetAddress, false, block.timestamp);
        return orderId;
    }

    function matchOrders(
        uint256 buyOrderId,
        uint256 sellOrderId,
        externalEuint64 fillAmount,
        bytes calldata inputProof
    ) external orderExists(buyOrderId) orderExists(sellOrderId) returns (uint256) {
        euint64 _fillAmount = FHE.fromExternal(fillAmount, inputProof);

        EncryptedOrder storage buyOrder = orders[buyOrderId];
        EncryptedOrder storage sellOrder = orders[sellOrderId];

        require(buyOrder.isBuyOrder, "NOT_BUY_ORDER");
        require(!sellOrder.isBuyOrder, "NOT_SELL_ORDER");
        require(buyOrder.assetAddress == sellOrder.assetAddress, "ASSET_MISMATCH");
        require(buyOrder.expirationTime > block.timestamp, "BUY_ORDER_EXPIRED");
        require(sellOrder.expirationTime > block.timestamp, "SELL_ORDER_EXPIRED");

        euint64 buyRemaining = FHE.sub(buyOrder.amount, buyOrder.filledAmount);
        euint64 sellRemaining = FHE.sub(sellOrder.amount, sellOrder.filledAmount);

        ebool canFillBuy = FHE.le(_fillAmount, buyRemaining);
        ebool canFillSell = FHE.le(_fillAmount, sellRemaining);
        ebool meetsMinBuy = FHE.ge(_fillAmount, buyOrder.minFillAmount);
        ebool meetsMinSell = FHE.ge(_fillAmount, sellOrder.minFillAmount);

        ebool canExecute = FHE.and(
            FHE.and(canFillBuy, canFillSell),
            FHE.and(meetsMinBuy, meetsMinSell)
        );

        euint64 executedAmount = FHE.select(canExecute, _fillAmount, FHE.asEuint64(0));

        buyOrder.filledAmount = FHE.add(buyOrder.filledAmount, executedAmount);
        sellOrder.filledAmount = FHE.add(sellOrder.filledAmount, executedAmount);

        ebool buyFilled = FHE.eq(buyOrder.filledAmount, buyOrder.amount);
        ebool sellFilled = FHE.eq(sellOrder.filledAmount, sellOrder.amount);

        buyOrder.isActive = FHE.select(buyFilled, FHE.asEbool(false), buyOrder.isActive);
        sellOrder.isActive = FHE.select(sellFilled, FHE.asEbool(false), sellOrder.isActive);

        uint256 matchId = matchCounter++;
        matches[matchId] = EncryptedMatch({
            matchId: matchId,
            buyOrderId: buyOrderId,
            sellOrderId: sellOrderId,
            matchedAmount: executedAmount,
            matchedPrice: buyOrder.price,
            isSettled: FHE.asEbool(false),
            timestamp: block.timestamp,
            buyer: buyOrder.owner,
            seller: sellOrder.owner
        });

        FHE.allow(matches[matchId].matchedAmount, buyOrder.owner);
        FHE.allow(matches[matchId].matchedAmount, sellOrder.owner);
        FHE.allow(matches[matchId].matchedPrice, buyOrder.owner);
        FHE.allow(matches[matchId].matchedPrice, sellOrder.owner);
        FHE.allowThis(matches[matchId].matchedAmount);
        FHE.allowThis(matches[matchId].matchedPrice);
        FHE.allowThis(matches[matchId].isSettled);

        userMatches[buyOrder.owner].push(matchId);
        userMatches[sellOrder.owner].push(matchId);

        emit OrderMatched(matchId, buyOrderId, sellOrderId, block.timestamp);

        return matchId;
    }

    function executeSettlement(uint256 matchId, externalEuint64 feeAmount, bytes calldata inputProof) external {
        require(matchId < matchCounter, "MATCH_NOT_EXIST");

        EncryptedMatch storage matchData = matches[matchId];
        EncryptedOrder storage buyOrder = orders[matchData.buyOrderId];
        EncryptedOrder storage sellOrder = orders[matchData.sellOrderId];

        euint64 _feeAmount = FHE.fromExternal(feeAmount, inputProof);
        euint64 tradeValue = FHE.mul(matchData.matchedAmount, matchData.matchedPrice);
        euint64 netValue = FHE.sub(tradeValue, _feeAmount);

        tokenBalances[matchData.buyer][buyOrder.assetAddress] = FHE.add(
            tokenBalances[matchData.buyer][buyOrder.assetAddress],
            matchData.matchedAmount
        );

        tokenBalances[matchData.seller][sellOrder.assetAddress] = FHE.add(
            tokenBalances[matchData.seller][sellOrder.assetAddress],
            netValue
        );

        tokenBalances[feeCollector][sellOrder.assetAddress] = FHE.add(
            tokenBalances[feeCollector][sellOrder.assetAddress],
            _feeAmount
        );

        matchData.isSettled = FHE.asEbool(true);

        FHE.allow(tokenBalances[matchData.buyer][buyOrder.assetAddress], matchData.buyer);
        FHE.allow(tokenBalances[matchData.seller][sellOrder.assetAddress], matchData.seller);

        emit SettlementExecuted(matchId, block.timestamp);
    }

    function cancelOrder(uint256 orderId) external onlyOrderOwner(orderId) orderExists(orderId) {
        EncryptedOrder storage order = orders[orderId];
        order.isActive = FHE.asEbool(false);
        emit OrderCancelled(orderId, msg.sender, block.timestamp);
    }

    function getOrder(uint256 orderId) external view orderExists(orderId) returns (
        uint256,
        address,
        address,
        euint64,
        euint64,
        euint64,
        bool,
        uint256,
        uint256
    ) {
        EncryptedOrder storage order = orders[orderId];
        require(msg.sender == order.owner, "NOT_AUTHORIZED");
        return (
            order.orderId,
            order.owner,
            order.assetAddress,
            order.amount,
            order.price,
            order.filledAmount,
            order.isBuyOrder,
            order.expirationTime,
            order.createdAt
        );
    }

    function getMatch(uint256 matchId) external view returns (
        uint256,
        uint256,
        uint256,
        euint64,
        euint64,
        uint256,
        address,
        address
    ) {
        require(matchId < matchCounter, "MATCH_NOT_EXIST");
        EncryptedMatch storage matchData = matches[matchId];
        require(msg.sender == matchData.buyer || msg.sender == matchData.seller, "NOT_AUTHORIZED");
        return (
            matchData.matchId,
            matchData.buyOrderId,
            matchData.sellOrderId,
            matchData.matchedAmount,
            matchData.matchedPrice,
            matchData.timestamp,
            matchData.buyer,
            matchData.seller
        );
    }

    function getBalance(address user, address asset) external view returns (euint64) {
        require(msg.sender == user, "NOT_AUTHORIZED");
        return tokenBalances[user][asset];
    }

    function getUserOrders(address user) external view returns (uint256[] memory) {
        require(msg.sender == user, "NOT_AUTHORIZED");
        return userOrders[user];
    }

    function getUserMatches(address user) external view returns (uint256[] memory) {
        require(msg.sender == user, "NOT_AUTHORIZED");
        return userMatches[user];
    }

    function deposit(address asset, externalEuint64 amount, bytes calldata inputProof) external {
        euint64 _amount = FHE.fromExternal(amount, inputProof);
        tokenBalances[msg.sender][asset] = FHE.add(tokenBalances[msg.sender][asset], _amount);
        FHE.allow(tokenBalances[msg.sender][asset], msg.sender);
        FHE.allowThis(tokenBalances[msg.sender][asset]);
        emit Deposit(msg.sender, asset, block.timestamp);
    }

    function withdraw(address asset, externalEuint64 amount, bytes calldata inputProof) external {
        euint64 _amount = FHE.fromExternal(amount, inputProof);
        euint64 currentBalance = tokenBalances[msg.sender][asset];

        euint64 newBalance = FHE.sub(currentBalance, _amount);
        tokenBalances[msg.sender][asset] = newBalance;

        FHE.allow(tokenBalances[msg.sender][asset], msg.sender);
        emit Withdrawal(msg.sender, asset, block.timestamp);
    }

    function setFeeCollector(address _feeCollector) external {
        require(msg.sender == feeCollector, "NOT_AUTHORIZED");
        require(_feeCollector != address(0), "INVALID_ADDRESS");
        feeCollector = _feeCollector;
    }
}
