# Vercel Deployment Guide

## Option 1: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository: `eyerematthew/testing`
4. Configure the project settings:

### Framework Preset
- Select: **Next.js**

### Root Directory
- Click "Edit" next to Root Directory
- Set to: `packages/nextjs`

### Build Settings
- Build Command: `pnpm build`
- Output Directory: `.next` (default)
- Install Command: `pnpm install`

### Environment Variables
Add these in the Vercel dashboard:
```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_OTC_MARKETPLACE_ADDRESS=0x...
NEXT_PUBLIC_COMPLIANCE_MODULE_ADDRESS=0x...
NEXT_PUBLIC_ORDERBOOK_ADDRESS=0x...
```

5. Click "Deploy"

## Option 2: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to the Next.js directory:
```bash
cd packages/nextjs
```

3. Deploy:
```bash
vercel
```

4. Follow prompts and set environment variables when asked

## Option 3: Deploy from Monorepo Root

If you want to deploy from root, the vercel.json is already configured.

1. In Vercel Dashboard, import the repo
2. Leave Root Directory as `.` (root)
3. The vercel.json will handle the build automatically
4. Add environment variables
5. Deploy

## Troubleshooting

### 404 Error
- Make sure Root Directory is set to `packages/nextjs` in Vercel settings
- Or ensure vercel.json is in the repository root

### Build Fails
- Check that all environment variables are set
- Verify pnpm is being used (should auto-detect from pnpm-workspace.yaml)
- Check build logs in Vercel dashboard

### Module Not Found Errors
- The @fhevm-sdk package may need to be built first
- Ensure packages/fhevm-sdk/dist exists
- May need to add a build script to handle monorepo dependencies

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
