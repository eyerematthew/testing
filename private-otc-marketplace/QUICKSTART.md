# Quick Start Guide

Get the Private OTC Marketplace running in 5 minutes.

## 1. Install Dependencies

```bash
cd /home/matt24/private-otc-marketplace
pnpm install
```

## 2. Configure Environment

```bash
cp .env.example .env
```

For local development, use default values in `.env.example`.

## 3. Start Hardhat Node

Terminal 1:
```bash
pnpm chain
```

## 4. Deploy Contracts

Terminal 2:
```bash
pnpm deploy:localhost
```

Note the deployed contract addresses.

## 5. Update Frontend

Edit `packages/nextjs/components/OTCTradingInterface.tsx`:

Replace:
```typescript
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3" as `0x${string}`;
```

With your OTCMarketplace address from deployment.

## 6. Start Frontend

Terminal 3:
```bash
pnpm start
```

## 7. Configure MetaMask

Add Hardhat network:
- Network Name: Hardhat Local
- RPC URL: http://localhost:8545
- Chain ID: 31337
- Currency Symbol: ETH

Import account using private key from Hardhat node output.

## 8. Open Application

Navigate to http://localhost:3000

## 9. Create First Order

1. Click "Connect Wallet"
2. Select MetaMask
3. Fill order form:
   - Asset Address: Any valid address
   - Amount: 1000
   - Price: 50
   - Min Fill: 100
   - Type: Buy
4. Click "Create Order"
5. Confirm in MetaMask

## 10. Test Matching

1. Create a sell order with same parameters
2. Note both order IDs from transaction receipts
3. Use "Match Orders" section
4. Enter buy and sell order IDs
5. Fill amount: 1000
6. Click "Match Orders"

## Troubleshooting

**MetaMask Nonce Error:**
- Settings → Advanced → Clear Activity Tab

**Contract Not Found:**
- Verify deployed address matches code
- Check network in MetaMask

**FHEVM Not Ready:**
- Wait for instance initialization
- Refresh page if stuck

**Transaction Fails:**
- Check sufficient ETH balance
- Verify input parameters
- Check browser console for errors

## Next Steps

- Read full README.md for detailed documentation
- Review DEPLOYMENT.md for production deployment
- Explore smart contracts in packages/hardhat/contracts
- Customize UI in packages/nextjs/components

## Development Commands

```bash
pnpm chain          # Start local blockchain
pnpm compile        # Compile contracts
pnpm deploy:localhost    # Deploy to local
pnpm deploy:sepolia      # Deploy to Sepolia
pnpm start          # Start frontend
pnpm build          # Build for production
```

## Support

Open GitHub issue for bugs or questions.
