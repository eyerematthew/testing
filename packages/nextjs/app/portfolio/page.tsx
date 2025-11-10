"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { BalanceManager } from "../../components/BalanceManager";

export default function PortfolioPage() {
  const { isConnected, address } = useAccount();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Connect Wallet</h2>
          <p className="text-gray-400 mb-8">Please connect your wallet to view portfolio</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-white">
              Private OTC
            </Link>
            <div className="flex gap-4">
              <Link href="/trade" className="text-gray-400 hover:text-white">
                Trade
              </Link>
              <Link href="/dashboard" className="text-gray-400 hover:text-white">
                Dashboard
              </Link>
              <Link href="/portfolio" className="text-purple-400 font-semibold">
                Portfolio
              </Link>
            </div>
          </div>
          <ConnectButton />
        </nav>

        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Portfolio</h2>
            <p className="text-gray-400 font-mono text-sm">{address}</p>
          </div>

          <BalanceManager />
        </div>
      </div>
    </div>
  );
}
