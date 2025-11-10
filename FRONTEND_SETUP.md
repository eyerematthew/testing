# Frontend Setup Instructions

## Current Status

The frontend application is fully built with all pages and components:

- Home page with wallet connection
- Trading interface with order creation, matching, and settlement
- Dashboard for viewing user orders and matches
- Portfolio page for balance management
- Complete UI components with Tailwind CSS styling

## Setup Steps

1. Install dependencies:
```bash
pnpm install
```

2. Build the FHE SDK:
```bash
cd packages/fhevm-sdk
pnpm build
```

3. Configure environment variables:
```bash
cp packages/nextjs/.env.example packages/nextjs/.env.local
```

Edit `.env.local` with your values:
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` - Get from WalletConnect Cloud
- `NEXT_PUBLIC_OTC_MARKETPLACE_ADDRESS` - Deployed OTCMarketplace contract address
- `NEXT_PUBLIC_COMPLIANCE_MODULE_ADDRESS` - Deployed ComplianceModule contract address
- `NEXT_PUBLIC_ORDERBOOK_ADDRESS` - Deployed EncryptedOrderbook contract address

4. Run development server:
```bash
pnpm start
```

## Architecture

### Pages
- `/` - Landing page with feature overview
- `/trade` - Main trading interface
- `/dashboard` - User orders and matches
- `/portfolio` - Balance management

### Components
- `CreateOrderForm` - Create buy/sell orders with encrypted parameters
- `OrderBook` - View all orders in the marketplace
- `MatchOrders` - Match buy/sell orders and execute settlement
- `MyOrders` - View and cancel user orders
- `MyMatches` - View user trading matches
- `BalanceManager` - Deposit/withdraw and check encrypted balances

### Hooks
- `useEthersSigner` - Convert Wagmi wallet client to ethers signer
- `useFHEEncryption` - Encrypt order data before submission
- `useFHEDecrypt` - Decrypt encrypted balances and order data

## Technology Stack

- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Wagmi 2 + RainbowKit for wallet connection
- Ethers.js 6 for contract interactions
- Zama FHEVM SDK for encryption

## Smart Contract Integration

All components integrate directly with the deployed smart contracts:
- OTCMarketplace - Order creation, matching, settlement
- EncryptedOrderbook - Order book management
- ComplianceModule - KYC/AML verification

## Production Deployment

For production deployment to Vercel, Netlify, or similar:

1. Ensure all environment variables are set
2. Build the application: `pnpm build`
3. Deploy the `packages/nextjs` directory
4. Configure NEXT_PUBLIC_ env vars in deployment platform

## Development

Run in development mode:
```bash
pnpm start
```

The app will be available at http://localhost:3000
