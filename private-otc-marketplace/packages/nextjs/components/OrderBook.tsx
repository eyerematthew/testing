"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { useEthersSigner } from "../hooks/useEthersSigner";

const OTC_MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_OTC_MARKETPLACE_ADDRESS || "";

const OTC_ABI = [
  "function getOrder(uint256 orderId) external view returns (uint256, address, address, tuple(bytes,bytes), tuple(bytes,bytes), tuple(bytes,bytes), bool, uint256, uint256)",
  "function orderCounter() external view returns (uint256)"
];

interface Order {
  orderId: number;
  owner: string;
  asset: string;
  isBuy: boolean;
  expiration: number;
  created: number;
}

export function OrderBook() {
  const { address } = useAccount();
  const signer = useEthersSigner();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "buy" | "sell">("all");

  const loadOrders = async () => {
    if (!signer) return;

    setIsLoading(true);
    try {
      const contract = new ethers.Contract(OTC_MARKETPLACE_ADDRESS, OTC_ABI, signer);
      const counter = await contract.orderCounter();
      const orderCount = Number(counter);

      const orderPromises = [];
      for (let i = 0; i < Math.min(orderCount, 50); i++) {
        orderPromises.push(
          contract.getOrder(i).catch(() => null)
        );
      }

      const results = await Promise.all(orderPromises);
      const validOrders: Order[] = results
        .map((result, i) => {
          if (!result) return null;
          return {
            orderId: i,
            owner: result[1],
            asset: result[2],
            isBuy: result[6],
            expiration: Number(result[7]),
            created: Number(result[8])
          };
        })
        .filter((order): order is Order => order !== null);

      setOrders(validOrders);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [signer]);

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    if (filter === "buy") return order.isBuy;
    if (filter === "sell") return !order.isBuy;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "all"
              ? "bg-purple-600 text-white"
              : "bg-slate-700 text-gray-400 hover:text-white"
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setFilter("buy")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "buy"
              ? "bg-green-600 text-white"
              : "bg-slate-700 text-gray-400 hover:text-white"
          }`}
        >
          Buy Orders
        </button>
        <button
          onClick={() => setFilter("sell")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "sell"
              ? "bg-red-600 text-white"
              : "bg-slate-700 text-gray-400 hover:text-white"
          }`}
        >
          Sell Orders
        </button>
        <button
          onClick={loadOrders}
          className="ml-auto px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No orders found</div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:border-purple-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.isBuy
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {order.isBuy ? "BUY" : "SELL"}
                    </span>
                    <span className="text-gray-400 text-sm">Order #{order.orderId}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    <div>Asset: {order.asset.slice(0, 10)}...{order.asset.slice(-8)}</div>
                    <div>Owner: {order.owner.slice(0, 10)}...{order.owner.slice(-8)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">
                    Expires: {new Date(order.expiration * 1000).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
