"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { MyOrders } from "../../components/MyOrders";
import { MyMatches } from "../../components/MyMatches";
import { useState } from "react";

export default function DashboardPage() {
  const { isConnected, address } = useAccount();
  const [activeTab, setActiveTab] = useState<"orders" | "matches">("orders");

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Connect Wallet</h2>
          <p className="text-gray-400 mb-8">Please connect your wallet to view dashboard</p>
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
              <Link href="/dashboard" className="text-purple-400 font-semibold">
                Dashboard
              </Link>
              <Link href="/portfolio" className="text-gray-400 hover:text-white">
                Portfolio
              </Link>
            </div>
          </div>
          <ConnectButton />
        </nav>

        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">My Dashboard</h2>
            <p className="text-gray-400 font-mono text-sm">{address}</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 overflow-hidden">
            <div className="flex border-b border-slate-700">
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "orders"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                My Orders
              </button>
              <button
                onClick={() => setActiveTab("matches")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "matches"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                My Matches
              </button>
            </div>

            <div className="p-8">
              {activeTab === "orders" && <MyOrders />}
              {activeTab === "matches" && <MyMatches />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
