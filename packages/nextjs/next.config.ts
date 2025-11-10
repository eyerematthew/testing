import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@fhevm-sdk"],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      "@fhevm-sdk/react": path.resolve(__dirname, "../fhevm-sdk/src/react"),
      "@fhevm-sdk": path.resolve(__dirname, "../fhevm-sdk/src")
    };
    return config;
  },
};

export default nextConfig;
