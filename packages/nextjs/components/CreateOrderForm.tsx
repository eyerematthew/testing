"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useFHEEncryption } from "@fhevm-sdk/react";
import { useEthersSigner } from "../hooks/useEthersSigner";
import { ethers } from "ethers";

const OTC_MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_OTC_MARKETPLACE_ADDRESS || "";

const OTC_ABI = [
  "function createBuyOrder(address assetAddress, tuple(bytes,bytes) amount, tuple(bytes,bytes) price, tuple(bytes,bytes) minFillAmount, bytes inputProof, uint256 expirationTime) external returns (uint256)",
  "function createSellOrder(address assetAddress, tuple(bytes,bytes) amount, tuple(bytes,bytes) price, tuple(bytes,bytes) minFillAmount, bytes inputProof, uint256 expirationTime) external returns (uint256)"
];

export function CreateOrderForm() {
  const { address } = useAccount();
  const signer = useEthersSigner();
  const { canEncrypt, encryptWith } = useFHEEncryption();

  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [assetAddress, setAssetAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [minFillAmount, setMinFillAmount] = useState("");
  const [expirationDays, setExpirationDays] = useState("7");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTxHash("");

    if (!signer || !address || !canEncrypt) {
      setError("Please connect wallet and wait for encryption to be ready");
      return;
    }

    if (!ethers.isAddress(assetAddress)) {
      setError("Invalid asset address");
      return;
    }

    setIsSubmitting(true);

    try {
      const amountValue = Math.floor(parseFloat(amount) * 1e18);
      const priceValue = Math.floor(parseFloat(price) * 1e18);
      const minFillValue = Math.floor(parseFloat(minFillAmount) * 1e18);

      const encrypted = await encryptWith((builder) => {
        builder.add64(amountValue);
        builder.add64(priceValue);
        builder.add64(minFillValue);
      });

      const expirationTime = Math.floor(Date.now() / 1000) + parseInt(expirationDays) * 86400;

      const contract = new ethers.Contract(OTC_MARKETPLACE_ADDRESS, OTC_ABI, signer);

      const tx = orderType === "buy"
        ? await contract.createBuyOrder(
            assetAddress,
            encrypted.handles[0],
            encrypted.handles[1],
            encrypted.handles[2],
            encrypted.inputProof,
            expirationTime
          )
        : await contract.createSellOrder(
            assetAddress,
            encrypted.handles[0],
            encrypted.handles[1],
            encrypted.handles[2],
            encrypted.inputProof,
            expirationTime
          );

      setTxHash(tx.hash);
      await tx.wait();

      setAssetAddress("");
      setAmount("");
      setPrice("");
      setMinFillAmount("");
    } catch (err: any) {
      setError(err.message || "Transaction failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setOrderType("buy")}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
            orderType === "buy"
              ? "bg-green-600 text-white"
              : "bg-slate-700 text-gray-400 hover:text-white"
          }`}
        >
          Buy Order
        </button>
        <button
          onClick={() => setOrderType("sell")}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
            orderType === "sell"
              ? "bg-red-600 text-white"
              : "bg-slate-700 text-gray-400 hover:text-white"
          }`}
        >
          Sell Order
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Asset Address</label>
          <input
            type="text"
            value={assetAddress}
            onChange={(e) => setAssetAddress(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            placeholder="0x..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
          <input
            type="number"
            step="0.000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            placeholder="0.0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
          <input
            type="number"
            step="0.000001"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            placeholder="0.0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Fill Amount</label>
          <input
            type="number"
            step="0.000001"
            value={minFillAmount}
            onChange={(e) => setMinFillAmount(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            placeholder="0.0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Expiration (days)</label>
          <input
            type="number"
            min="1"
            value={expirationDays}
            onChange={(e) => setExpirationDays(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            required
          />
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {txHash && (
          <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-400">
            Transaction submitted: {txHash.slice(0, 10)}...
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !canEncrypt}
          className="w-full px-6 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-gray-500 text-white rounded-lg font-semibold transition-colors"
        >
          {isSubmitting ? "Creating Order..." : `Create ${orderType === "buy" ? "Buy" : "Sell"} Order`}
        </button>
      </form>
    </div>
  );
}
