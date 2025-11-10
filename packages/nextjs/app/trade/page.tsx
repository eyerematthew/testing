"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { CreateOrderForm } from "../../components/CreateOrderForm";
import { OrderBook } from "../../components/OrderBook";
import { MatchOrders } from "../../components/MatchOrders";

export default function TradePage() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"create" | "match" | "book">("create");

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Connect Wallet</h2>
          <p className="text-gray-400 mb-8">Please connect your wallet to access trading</p>
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
              <Link href="/trade" className="text-purple-400 font-semibold">
                Trade
              </Link>
              <Link href="/dashboard" className="text-gray-400 hover:text-white">
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
          <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 overflow-hidden">
            <div className="flex border-b border-slate-700">
              <button
                onClick={() => setActiveTab("create")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "create"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Create Order
              </button>
              <button
                onClick={() => setActiveTab("match")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "match"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Match Orders
              </button>
              <button
                onClick={() => setActiveTab("book")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "book"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Order Book
              </button>
            </div>

            <div className="p-8">
              {activeTab === "create" && <CreateOrderForm />}
              {activeTab === "match" && <MatchOrders />}
              {activeTab === "book" && <OrderBook />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
