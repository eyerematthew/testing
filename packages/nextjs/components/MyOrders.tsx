"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { useEthersSigner } from "../hooks/useEthersSigner";

const OTC_MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_OTC_MARKETPLACE_ADDRESS || "";

const OTC_ABI = [
  "function getUserOrders(address user) external view returns (uint256[])",
  "function getOrder(uint256 orderId) external view returns (uint256, address, address, tuple(bytes,bytes), tuple(bytes,bytes), tuple(bytes,bytes), bool, uint256, uint256)",
  "function cancelOrder(uint256 orderId) external"
];

interface Order {
  orderId: number;
  owner: string;
  asset: string;
  isBuy: boolean;
  expiration: number;
  created: number;
}

export function MyOrders() {
  const { address } = useAccount();
  const signer = useEthersSigner();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const loadMyOrders = async () => {
    if (!signer || !address) return;

    setIsLoading(true);
    try {
      const contract = new ethers.Contract(OTC_MARKETPLACE_ADDRESS, OTC_ABI, signer);
      const orderIds = await contract.getUserOrders(address);

      const orderPromises = orderIds.map(async (id: bigint) => {
        try {
          const result = await contract.getOrder(Number(id));
          return {
            orderId: Number(id),
            owner: result[1],
            asset: result[2],
            isBuy: result[6],
            expiration: Number(result[7]),
            created: Number(result[8])
          };
        } catch {
          return null;
        }
      });

      const results = await Promise.all(orderPromises);
      setOrders(results.filter((order): order is Order => order !== null));
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (orderId: number) => {
    if (!signer) return;

    setCancellingId(orderId);
    try {
      const contract = new ethers.Contract(OTC_MARKETPLACE_ADDRESS, OTC_ABI, signer);
      const tx = await contract.cancelOrder(orderId);
      await tx.wait();
      await loadMyOrders();
    } catch (err) {
      console.error("Cancel failed", err);
    } finally {
      setCancellingId(null);
    }
  };

  useEffect(() => {
    loadMyOrders();
  }, [signer, address]);

  if (isLoading) {
    return <div className="text-center py-12 text-gray-400">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">You have no active orders</p>
        <a
          href="/trade"
          className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
        >
          Create Your First Order
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Your Orders ({orders.length})</h3>
        <button
          onClick={loadMyOrders}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
        >
          Refresh
        </button>
      </div>

      {orders.map((order) => (
        <div
          key={order.orderId}
          className="bg-slate-700/50 border border-slate-600 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
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
            <button
              onClick={() => handleCancel(order.orderId)}
              disabled={cancellingId === order.orderId}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-gray-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {cancellingId === order.orderId ? "Cancelling..." : "Cancel"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Asset:</span>
              <div className="text-white font-mono">
                {order.asset.slice(0, 10)}...{order.asset.slice(-8)}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Created:</span>
              <div className="text-white">
                {new Date(order.created * 1000).toLocaleDateString()}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Expires:</span>
              <div className="text-white">
                {new Date(order.expiration * 1000).toLocaleDateString()}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Status:</span>
              <div className="text-green-400 font-semibold">Active</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
