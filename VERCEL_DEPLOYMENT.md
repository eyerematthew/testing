# Vercel Deployment Guide

## Recommended: Deploy from Monorepo Root (Using vercel.json)

This is the easiest method - the `vercel.json` is already configured.

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository: `eyerematthew/testing`
4. Configure the project settings:

### Framework Preset
- Select: **Next.js**

### Root Directory
- **IMPORTANT: Leave as `.` (root) - DO NOT change this**
- The vercel.json will automatically handle the monorepo structure

### Build Settings
- Leave all build settings as default
- The vercel.json configures everything automatically

### Environment Variables
Add these in the Vercel dashboard:
```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_OTC_MARKETPLACE_ADDRESS=0x...
NEXT_PUBLIC_COMPLIANCE_MODULE_ADDRESS=0x...
NEXT_PUBLIC_ORDERBOOK_ADDRESS=0x...
```

5. Click "Deploy"

## Alternative: Deploy Nextjs Package Directly

If you prefer to deploy only the nextjs package without the monorepo setup:

1. In Vercel Dashboard, import the repo
2. Set Root Directory to: `packages/nextjs`
3. Build Command: `pnpm build`
4. Output Directory: `.next`
5. Install Command: `pnpm install`
6. Add environment variables
7. Deploy

**Note**: This method won't build the @fhevm-sdk dependency automatically.

## Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. From repository root:
```bash
vercel
```

3. Follow prompts and set environment variables when asked

## Troubleshooting

### 404 Error
- Ensure Root Directory is set to `.` (root) in Vercel settings
- Check that vercel.json exists in the repository root
- Verify the deployment completed successfully

### Build Fails with "No such file or directory"
- **Most common issue**: Root Directory is incorrectly set to `packages/nextjs`
- **Fix**: Go to Project Settings → General → Root Directory → Set to `.` (root)
- The vercel.json must run from the repository root to access all packages

### Build Fails - General
- Check that all environment variables are set
- Verify pnpm is being used (should auto-detect from pnpm-workspace.yaml)
- Check build logs in Vercel dashboard for specific errors

### Module Not Found Errors
- Ensure the build command built @fhevm-sdk first (check build logs)
- The vercel.json handles building @fhevm-sdk before the Next.js app
- Check that pnpm workspace is properly configured

## Post-Deployment

After successful deployment:
1. Get your deployment URL from Vercel
2. Test wallet connection
3. Deploy smart contracts to network (Sepolia or mainnet)
4. Update environment variables with deployed contract addresses
5. Redeploy

## Custom Domain

To add custom domain:
1. Go to project settings in Vercel
2. Navigate to "Domains"
3. Add your domain and follow DNS configuration steps
