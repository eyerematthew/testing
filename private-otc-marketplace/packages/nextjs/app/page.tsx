"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold text-white">Private OTC</h1>
          <ConnectButton />
        </nav>

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-6xl font-bold text-white mb-4">
            Encrypted Trading
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Zero Knowledge
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Trade assets with complete privacy using fully homomorphic encryption.
            Your orders, prices, and volumes remain encrypted on-chain.
          </p>

          {isConnected ? (
            <div className="flex gap-4 justify-center mt-12">
              <Link
                href="/trade"
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-lg transition-all"
              >
                Start Trading
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold text-lg transition-all"
              >
                My Dashboard
              </Link>
            </div>
          ) : (
            <div className="mt-12">
              <p className="text-gray-400 mb-4">Connect your wallet to get started</p>
              <ConnectButton />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-slate-700">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-white mb-2">Fully Encrypted</h3>
              <p className="text-gray-400">
                All order data encrypted with FHE. No one can see your trading activity.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-slate-700">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">Instant Matching</h3>
              <p className="text-gray-400">
                Orders matched automatically with encrypted price discovery.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur p-6 rounded-xl border border-slate-700">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-white mb-2">KYC Compliant</h3>
              <p className="text-gray-400">
                Built-in compliance module with encrypted user verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
