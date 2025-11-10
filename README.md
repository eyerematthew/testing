# Private OTC Marketplace

Production-ready Over-the-Counter trading platform with end-to-end encryption using Zama FHEVM SDK.

## Features

- Fully encrypted order creation and matching
- Private price discovery
- Confidential settlement
- Compliance module with KYC/AML support
- Encrypted orderbook with price-time priority
- Multi-asset support
- Partial order fills
- Automated fee distribution

## Prerequisites

- Node.js v20+
- pnpm
- MetaMask or compatible Web3 wallet

## Installation

```bash
pnpm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Configure environment variables:
- `MNEMONIC`: Your wallet mnemonic (12-24 words)
- `INFURA_API_KEY`: Get from https://infura.io
- `ETHERSCAN_API_KEY`: Get from https://etherscan.io
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: Get from https://cloud.walletconnect.com

## Local Development

### Start Hardhat Node

```bash
pnpm chain
```

### Deploy Contracts

```bash
pnpm deploy:localhost
```

### Start Frontend

```bash
pnpm start
```

Access at http://localhost:3000

### Configure MetaMask

- Network Name: Hardhat Local
- RPC URL: http://localhost:8545
- Chain ID: 31337
- Currency Symbol: ETH

## Sepolia Testnet Deployment

```bash
pnpm deploy:sepolia
```

Update contract addresses in `packages/nextjs/components/OTCTradingInterface.tsx`

## Smart Contracts

### OTCMarketplace

Main trading contract handling order creation, matching, and settlement.

**Key Functions:**
- `createOrder()` - Create encrypted buy/sell order
- `matchOrders()` - Match compatible orders
- `executeSettlement()` - Settle matched trades
- `cancelOrder()` - Cancel active order
- `deposit()/withdraw()` - Manage encrypted balances

### EncryptedOrderbook

Maintains sorted encrypted order lists with price-time priority.

**Key Functions:**
- `insertOrder()` - Add order to orderbook
- `removeOrder()` - Remove order from orderbook
- `findMatchingOrders()` - Search for compatible orders
- `getBestOrder()` - Get best available order

### ComplianceModule

Handles KYC/AML compliance with encrypted user data.

**Key Functions:**
- `updateKYC()` - Update user verification status
- `canTrade()` - Check trading eligibility
- `recordTrade()` - Track trading volumes
- `blockJurisdiction()` - Restrict by jurisdiction

## Usage

### Create Order

1. Enter asset address
2. Specify amount, price, and minimum fill
3. Select buy/sell
4. Set expiration period
5. Click "Create Order"

### Match Orders

1. Enter buy and sell order IDs
2. Specify fill amount
3. Click "Match Orders"

### Execute Settlement

1. Enter match ID
2. Click "Execute Settlement"

### View Balances

Encrypted balances are only visible to the owner through re-encryption.

## Architecture

```
packages/
├── hardhat/          Smart contracts and deployment
│   ├── contracts/    Solidity contracts
│   ├── deploy/       Deployment scripts
│   └── test/         Contract tests
└── nextjs/           Frontend application
    ├── app/          Next.js app router
    ├── components/   React components
    └── hooks/        Custom React hooks
```

## Security

- All sensitive data encrypted end-to-end
- Zero-knowledge proofs for input verification
- Access Control List (ACL) enforcement
- Multi-party computation for decryption
- No plaintext exposure on-chain

## Production Deployment

### Smart Contracts

1. Configure production network in `hardhat.config.ts`
2. Deploy contracts: `pnpm deploy:sepolia`
3. Verify on Etherscan
4. Update frontend contract addresses

### Frontend

1. Build production bundle: `pnpm build`
2. Deploy to Vercel/Netlify
3. Configure environment variables
4. Enable HTTPS

## License

MIT

## Support

For issues and questions, please open a GitHub issue.
