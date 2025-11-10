# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Setup

Ensure all required API keys and credentials are configured:

```bash
MNEMONIC="your production mnemonic"
INFURA_API_KEY=your_infura_key
ETHERSCAN_API_KEY=your_etherscan_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_id
```

### 2. Security Audit

- [ ] Smart contracts audited by reputable firm
- [ ] All TODO items addressed
- [ ] Access control verified
- [ ] Fee parameters validated
- [ ] Emergency pause mechanism tested

### 3. Testing

```bash
cd packages/hardhat
pnpm test
```

Ensure 100% test coverage on critical paths:
- Order creation and cancellation
- Order matching logic
- Settlement execution
- ACL permissions
- Compliance checks

## Deployment Steps

### Step 1: Deploy to Sepolia Testnet

```bash
cd /home/matt24/private-otc-marketplace
pnpm compile
pnpm deploy:sepolia
```

Save deployed contract addresses:
```
OTCMarketplace: 0x...
EncryptedOrderbook: 0x...
ComplianceModule: 0x...
```

### Step 2: Verify Contracts

```bash
cd packages/hardhat
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Example:
```bash
npx hardhat verify --network sepolia 0xYourOTCMarketplaceAddress "0xFeeCollector" 30
```

### Step 3: Update Frontend Configuration

Edit `packages/nextjs/components/OTCTradingInterface.tsx`:

```typescript
const CONTRACT_ADDRESS = "0xYourDeployedAddress" as `0x${string}`;
```

### Step 4: Frontend Build

```bash
cd packages/nextjs
pnpm build
```

### Step 5: Deploy Frontend

#### Option A: Vercel

```bash
cd packages/nextjs
vercel --prod
```

Configure environment variables in Vercel dashboard:
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`

#### Option B: Self-Hosted

```bash
pnpm build
pnpm start
```

Use PM2 or systemd for process management.

### Step 6: Post-Deployment Verification

Test critical workflows:

1. **Create Order**
   - Connect wallet
   - Create buy order
   - Verify order appears on-chain
   - Confirm encryption working

2. **Match Orders**
   - Create sell order
   - Match with buy order
   - Verify matching logic

3. **Execute Settlement**
   - Settle matched trade
   - Verify balance updates
   - Check fee distribution

4. **Compliance**
   - Update KYC status
   - Test trading limits
   - Verify jurisdiction blocks

## Mainnet Deployment

### Prerequisites

- [ ] Sepolia testing complete
- [ ] Security audit passed
- [ ] Insurance obtained
- [ ] Legal compliance verified
- [ ] Support infrastructure ready

### Additional Steps

1. Update hardhat.config.ts with mainnet RPC
2. Fund deployer wallet with sufficient ETH
3. Deploy with gas optimization
4. Multi-sig for admin functions
5. Gradual rollout plan

### Gas Optimization

```solidity
feeBasisPoints = 30;
```

Estimated deployment costs (Mainnet):
- OTCMarketplace: ~3-5M gas
- EncryptedOrderbook: ~2-3M gas
- ComplianceModule: ~2-3M gas

At 30 gwei: ~$300-400 total

### Monitoring

Set up monitoring for:
- Contract events
- Gas consumption
- Failed transactions
- Unusual trading patterns
- Compliance violations

### Emergency Procedures

1. **Pause Trading**
   - Implement emergency pause in OTCMarketplace
   - Multi-sig approval required

2. **Bug Discovery**
   - Pause affected functions
   - Notify users via frontend
   - Deploy fix
   - Resume operations

3. **Upgrade Path**
   - Use proxy pattern for upgradability
   - Transparent proxy recommended
   - Multi-sig for upgrades

## Production Configuration

### Recommended Settings

**Fees:**
- Trading fee: 0.3% (30 basis points)
- Minimum order: $1,000 equivalent
- Maximum order: $10M equivalent

**Compliance:**
- KYC required: Yes
- AML screening: Yes
- Geographic restrictions: As per legal

**Performance:**
- Order expiration: 7 days default
- Minimum fill: 10% of order size
- Settlement window: Immediate

## Support Infrastructure

### Required Services

1. **Customer Support**
   - Email support
   - Discord/Telegram community
   - Documentation site

2. **Analytics**
   - Trading volume tracking
   - User growth metrics
   - Fee collection monitoring

3. **Compliance**
   - KYC provider integration
   - AML screening service
   - Regulatory reporting

## Scaling Considerations

### Phase 1: Launch (0-1000 users)
- Single chain (Sepolia/Mainnet)
- Manual KYC review
- Basic support

### Phase 2: Growth (1000-10000 users)
- Multi-chain support
- Automated KYC
- Enhanced UI/UX
- Mobile app

### Phase 3: Scale (10000+ users)
- Layer 2 deployment
- Advanced order types
- Institutional features
- API for integrations

## Maintenance

### Regular Tasks

**Daily:**
- Monitor trading activity
- Check for failed transactions
- Review compliance alerts

**Weekly:**
- Update KYC records
- Generate trading reports
- Security scan

**Monthly:**
- Smart contract audit
- Performance optimization
- Feature updates

## Rollback Procedure

If critical issues discovered:

1. Pause contract immediately
2. Snapshot current state
3. Notify all users
4. Deploy fix to testnet
5. Test thoroughly
6. Deploy to mainnet
7. Resume operations
8. Post-mortem report

## Success Metrics

Track:
- Total Value Locked (TVL)
- Daily Active Users (DAU)
- Transaction count
- Average order size
- Settlement success rate
- User retention

Target metrics:
- $1M TVL in Month 1
- $10M TVL in Month 3
- $100M TVL in Year 1

## Legal Compliance

Ensure:
- Terms of Service
- Privacy Policy
- KYC/AML procedures
- Securities law compliance
- Tax reporting
- User data protection (GDPR)

## Contact

Deployment Team: deployment@otc-marketplace.com
Support: support@otc-marketplace.com
Security: security@otc-marketplace.com
