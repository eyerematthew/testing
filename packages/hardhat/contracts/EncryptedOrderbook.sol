// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint64, euint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract EncryptedOrderbook is SepoliaConfig {

    struct OrderNode {
        uint256 orderId;
        euint64 price;
        euint64 amount;
        uint256 timestamp;
        uint256 nextOrderId;
        bool exists;
    }

    mapping(uint256 => OrderNode) public orderNodes;
    mapping(address => uint256) public buyHeadIds;
    mapping(address => uint256) public sellHeadIds;
    mapping(address => uint256) public assetOrderCounts;

    address public marketplace;

    event OrderInserted(uint256 indexed orderId, address indexed asset, bool isBuy, uint256 timestamp);
    event OrderRemoved(uint256 indexed orderId, address indexed asset, bool isBuy, uint256 timestamp);

    modifier onlyMarketplace() {
        require(msg.sender == marketplace, "NOT_MARKETPLACE");
        _;
    }

    constructor(address _marketplace) {
        require(_marketplace != address(0), "INVALID_MARKETPLACE");
        marketplace = _marketplace;
    }

    function insertBuyOrder(
        uint256 orderId,
        address asset,
        euint64 price,
        euint64 amount
    ) external onlyMarketplace {
        require(!orderNodes[orderId].exists, "ORDER_EXISTS");

        orderNodes[orderId] = OrderNode({
            orderId: orderId,
            price: price,
            amount: amount,
            timestamp: block.timestamp,
            nextOrderId: 0,
            exists: true
        });

        FHE.allowThis(price);
        FHE.allowThis(amount);

        uint256 headId = buyHeadIds[asset];
        if (headId == 0) {
            buyHeadIds[asset] = orderId;
        } else {
            orderNodes[headId].nextOrderId = orderId;
        }

        assetOrderCounts[asset]++;
        emit OrderInserted(orderId, asset, true, block.timestamp);
    }

    function insertSellOrder(
        uint256 orderId,
        address asset,
        euint64 price,
        euint64 amount
    ) external onlyMarketplace {
        require(!orderNodes[orderId].exists, "ORDER_EXISTS");

        orderNodes[orderId] = OrderNode({
            orderId: orderId,
            price: price,
            amount: amount,
            timestamp: block.timestamp,
            nextOrderId: 0,
            exists: true
        });

        FHE.allowThis(price);
        FHE.allowThis(amount);

        uint256 headId = sellHeadIds[asset];
        if (headId == 0) {
            sellHeadIds[asset] = orderId;
        } else {
            orderNodes[headId].nextOrderId = orderId;
        }

        assetOrderCounts[asset]++;
        emit OrderInserted(orderId, asset, false, block.timestamp);
    }

    function removeBuyOrder(uint256 orderId, address asset) external onlyMarketplace {
        require(orderNodes[orderId].exists, "ORDER_NOT_EXIST");

        uint256 headId = buyHeadIds[asset];

        if (headId == orderId) {
            buyHeadIds[asset] = orderNodes[orderId].nextOrderId;
        } else {
            uint256 currentId = headId;
            while (currentId != 0 && orderNodes[currentId].nextOrderId != orderId) {
                currentId = orderNodes[currentId].nextOrderId;
            }
            if (currentId != 0) {
                orderNodes[currentId].nextOrderId = orderNodes[orderId].nextOrderId;
            }
        }

        delete orderNodes[orderId];
        assetOrderCounts[asset]--;
        emit OrderRemoved(orderId, asset, true, block.timestamp);
    }

    function removeSellOrder(uint256 orderId, address asset) external onlyMarketplace {
        require(orderNodes[orderId].exists, "ORDER_NOT_EXIST");

        uint256 headId = sellHeadIds[asset];

        if (headId == orderId) {
            sellHeadIds[asset] = orderNodes[orderId].nextOrderId;
        } else {
            uint256 currentId = headId;
            while (currentId != 0 && orderNodes[currentId].nextOrderId != orderId) {
                currentId = orderNodes[currentId].nextOrderId;
            }
            if (currentId != 0) {
                orderNodes[currentId].nextOrderId = orderNodes[orderId].nextOrderId;
            }
        }

        delete orderNodes[orderId];
        assetOrderCounts[asset]--;
        emit OrderRemoved(orderId, asset, false, block.timestamp);
    }

    function getBestBuyOrder(address asset) external view returns (uint256) {
        return buyHeadIds[asset];
    }

    function getBestSellOrder(address asset) external view returns (uint256) {
        return sellHeadIds[asset];
    }

    function getOrderDetails(uint256 orderId) external view returns (
        euint64 price,
        euint64 amount,
        uint256 timestamp,
        uint256 nextOrderId
    ) {
        require(orderNodes[orderId].exists, "ORDER_NOT_EXIST");
        OrderNode storage node = orderNodes[orderId];
        return (node.price, node.amount, node.timestamp, node.nextOrderId);
    }

    function getAssetOrderCount(address asset) external view returns (uint256) {
        return assetOrderCounts[asset];
    }

    function getSellOrders(address asset, uint256 maxCount) external view returns (uint256[] memory) {
        uint256[] memory results = new uint256[](maxCount);
        uint256 currentId = sellHeadIds[asset];
        uint256 count = 0;

        while (currentId != 0 && count < maxCount) {
            results[count] = currentId;
            currentId = orderNodes[currentId].nextOrderId;
            count++;
        }

        uint256[] memory trimmed = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            trimmed[i] = results[i];
        }
        return trimmed;
    }

    function getBuyOrders(address asset, uint256 maxCount) external view returns (uint256[] memory) {
        uint256[] memory results = new uint256[](maxCount);
        uint256 currentId = buyHeadIds[asset];
        uint256 count = 0;

        while (currentId != 0 && count < maxCount) {
            results[count] = currentId;
            currentId = orderNodes[currentId].nextOrderId;
            count++;
        }

        uint256[] memory trimmed = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            trimmed[i] = results[i];
        }
        return trimmed;
    }
}
