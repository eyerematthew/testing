// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint64, euint8, ebool, externalEuint64, externalEuint8, externalEbool} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract ComplianceModule is SepoliaConfig {

    struct EncryptedKYC {
        ebool isVerified;
        ebool isAccredited;
        euint8 riskLevel;
        euint8 jurisdiction;
        euint64 dailyLimit;
        euint64 monthlyLimit;
        euint64 dailyVolume;
        euint64 monthlyVolume;
        uint256 lastDayReset;
        uint256 lastMonthReset;
        uint256 lastUpdate;
    }

    mapping(address => EncryptedKYC) private kycRecords;
    mapping(euint8 => ebool) private blockedJurisdictions;
    mapping(address => bool) public complianceOfficers;

    address public admin;
    address public marketplace;

    event KYCUpdated(address indexed user, uint256 timestamp);
    event JurisdictionBlocked(uint256 timestamp);
    event JurisdictionUnblocked(uint256 timestamp);
    event ComplianceOfficerAdded(address indexed officer, uint256 timestamp);
    event ComplianceOfficerRemoved(address indexed officer, uint256 timestamp);
    event VolumeRecorded(address indexed user, uint256 timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "NOT_ADMIN");
        _;
    }

    modifier onlyComplianceOfficer() {
        require(complianceOfficers[msg.sender], "NOT_OFFICER");
        _;
    }

    modifier onlyMarketplace() {
        require(msg.sender == marketplace, "NOT_MARKETPLACE");
        _;
    }

    constructor(address _admin, address _marketplace) {
        require(_admin != address(0), "INVALID_ADMIN");
        require(_marketplace != address(0), "INVALID_MARKETPLACE");
        admin = _admin;
        marketplace = _marketplace;
        complianceOfficers[_admin] = true;
    }

    function addComplianceOfficer(address officer) external onlyAdmin {
        require(officer != address(0), "INVALID_OFFICER");
        complianceOfficers[officer] = true;
        emit ComplianceOfficerAdded(officer, block.timestamp);
    }

    function removeComplianceOfficer(address officer) external onlyAdmin {
        complianceOfficers[officer] = false;
        emit ComplianceOfficerRemoved(officer, block.timestamp);
    }

    function updateKYC(
        address user,
        externalEbool isVerified,
        externalEbool isAccredited,
        externalEuint8 riskLevel,
        externalEuint8 jurisdiction,
        externalEuint64 dailyLimit,
        externalEuint64 monthlyLimit,
        bytes calldata inputProof
    ) external onlyComplianceOfficer {
        require(user != address(0), "INVALID_USER");

        ebool _isVerified = FHE.fromExternal(isVerified, inputProof);
        ebool _isAccredited = FHE.fromExternal(isAccredited, inputProof);
        euint8 _riskLevel = FHE.fromExternal(riskLevel, inputProof);
        euint8 _jurisdiction = FHE.fromExternal(jurisdiction, inputProof);
        euint64 _dailyLimit = FHE.fromExternal(dailyLimit, inputProof);
        euint64 _monthlyLimit = FHE.fromExternal(monthlyLimit, inputProof);

        kycRecords[user] = EncryptedKYC({
            isVerified: _isVerified,
            isAccredited: _isAccredited,
            riskLevel: _riskLevel,
            jurisdiction: _jurisdiction,
            dailyLimit: _dailyLimit,
            monthlyLimit: _monthlyLimit,
            dailyVolume: FHE.asEuint64(0),
            monthlyVolume: FHE.asEuint64(0),
            lastDayReset: block.timestamp,
            lastMonthReset: block.timestamp,
            lastUpdate: block.timestamp
        });

        FHE.allow(kycRecords[user].isVerified, user);
        FHE.allow(kycRecords[user].isAccredited, user);
        FHE.allow(kycRecords[user].dailyVolume, user);
        FHE.allow(kycRecords[user].monthlyVolume, user);
        FHE.allowThis(kycRecords[user].isVerified);
        FHE.allowThis(kycRecords[user].isAccredited);
        FHE.allowThis(kycRecords[user].riskLevel);
        FHE.allowThis(kycRecords[user].jurisdiction);
        FHE.allowThis(kycRecords[user].dailyLimit);
        FHE.allowThis(kycRecords[user].monthlyLimit);
        FHE.allowThis(kycRecords[user].dailyVolume);
        FHE.allowThis(kycRecords[user].monthlyVolume);

        emit KYCUpdated(user, block.timestamp);
    }

    function canTrade(address user, euint64 tradeAmount) external returns (ebool) {
        EncryptedKYC storage kyc = kycRecords[user];

        ebool verified = kyc.isVerified;
        ebool jurisdictionNotBlocked = FHE.not(blockedJurisdictions[kyc.jurisdiction]);
        ebool lowRisk = FHE.lt(kyc.riskLevel, FHE.asEuint8(8));

        euint64 newDailyTotal = FHE.add(kyc.dailyVolume, tradeAmount);
        euint64 newMonthlyTotal = FHE.add(kyc.monthlyVolume, tradeAmount);

        ebool withinDailyLimit = FHE.le(newDailyTotal, kyc.dailyLimit);
        ebool withinMonthlyLimit = FHE.le(newMonthlyTotal, kyc.monthlyLimit);

        ebool canTradeResult = FHE.and(
            FHE.and(FHE.and(verified, jurisdictionNotBlocked), lowRisk),
            FHE.and(withinDailyLimit, withinMonthlyLimit)
        );

        return canTradeResult;
    }

    function recordTrade(address user, euint64 amount) external onlyMarketplace {
        EncryptedKYC storage kyc = kycRecords[user];

        if (block.timestamp >= kyc.lastDayReset + 1 days) {
            kyc.dailyVolume = FHE.asEuint64(0);
            kyc.lastDayReset = block.timestamp;
        }

        if (block.timestamp >= kyc.lastMonthReset + 30 days) {
            kyc.monthlyVolume = FHE.asEuint64(0);
            kyc.lastMonthReset = block.timestamp;
        }

        kyc.dailyVolume = FHE.add(kyc.dailyVolume, amount);
        kyc.monthlyVolume = FHE.add(kyc.monthlyVolume, amount);

        FHE.allow(kyc.dailyVolume, user);
        FHE.allow(kyc.monthlyVolume, user);

        emit VolumeRecorded(user, block.timestamp);
    }

    function blockJurisdiction(externalEuint8 jurisdictionCode, bytes calldata inputProof) external onlyComplianceOfficer {
        euint8 code = FHE.fromExternal(jurisdictionCode, inputProof);
        blockedJurisdictions[code] = FHE.asEbool(true);
        FHE.allowThis(blockedJurisdictions[code]);
        emit JurisdictionBlocked(block.timestamp);
    }

    function unblockJurisdiction(externalEuint8 jurisdictionCode, bytes calldata inputProof) external onlyComplianceOfficer {
        euint8 code = FHE.fromExternal(jurisdictionCode, inputProof);
        blockedJurisdictions[code] = FHE.asEbool(false);
        FHE.allowThis(blockedJurisdictions[code]);
        emit JurisdictionUnblocked(block.timestamp);
    }

    function isUserVerified(address user) external view returns (ebool) {
        return kycRecords[user].isVerified;
    }

    function getUserDailyVolume(address user) external view returns (euint64) {
        require(msg.sender == user || complianceOfficers[msg.sender], "NOT_AUTHORIZED");
        return kycRecords[user].dailyVolume;
    }

    function getUserMonthlyVolume(address user) external view returns (euint64) {
        require(msg.sender == user || complianceOfficers[msg.sender], "NOT_AUTHORIZED");
        return kycRecords[user].monthlyVolume;
    }

    function resetVolumes(address user) external onlyComplianceOfficer {
        EncryptedKYC storage kyc = kycRecords[user];
        kyc.dailyVolume = FHE.asEuint64(0);
        kyc.monthlyVolume = FHE.asEuint64(0);
        kyc.lastDayReset = block.timestamp;
        kyc.lastMonthReset = block.timestamp;
        FHE.allow(kyc.dailyVolume, user);
        FHE.allow(kyc.monthlyVolume, user);
    }
}
