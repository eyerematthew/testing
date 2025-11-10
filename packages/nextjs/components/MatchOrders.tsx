"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useFHEEncryption } from "@fhevm-sdk/react";
import { useEthersSigner } from "../hooks/useEthersSigner";
import { ethers } from "ethers";

const OTC_MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_OTC_MARKETPLACE_ADDRESS || "";

const OTC_ABI = [
  "function matchOrders(uint256 buyOrderId, uint256 sellOrderId, tuple(bytes,bytes) fillAmount, bytes inputProof) external returns (uint256)",
  "function executeSettlement(uint256 matchId, tuple(bytes,bytes) feeAmount, bytes inputProof) external"
];

export function MatchOrders() {
  const { address } = useAccount();
  const signer = useEthersSigner();
  const { canEncrypt, encryptWith } = useFHEEncryption();

  const [buyOrderId, setBuyOrderId] = useState("");
  const [sellOrderId, setSellOrderId] = useState("");
  const [fillAmount, setFillAmount] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [matchId, setMatchId] = useState("");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  const [feeAmount, setFeeAmount] = useState("");
  const [isSettling, setIsSettling] = useState(false);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTxHash("");

    if (!signer || !address || !canEncrypt) {
      setError("Please connect wallet and wait for encryption to be ready");
      return;
    }

    setIsMatching(true);

    try {
      const fillValue = Math.floor(parseFloat(fillAmount) * 1e18);

      const encrypted = await encryptWith((builder) => {
        builder.add64(fillValue);
      });

      const contract = new ethers.Contract(OTC_MARKETPLACE_ADDRESS, OTC_ABI, signer);

      const tx = await contract.matchOrders(
        parseInt(buyOrderId),
        parseInt(sellOrderId),
        encrypted.handles[0],
        encrypted.inputProof
      );

      setTxHash(tx.hash);
      const receipt = await tx.wait();

      const matchEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === "OrderMatched";
        } catch {
          return false;
        }
      });

      if (matchEvent) {
        const parsed = contract.interface.parseLog(matchEvent);
        setMatchId(parsed?.args[0].toString() || "");
      }

      setBuyOrderId("");
      setSellOrderId("");
      setFillAmount("");
    } catch (err: any) {
      setError(err.message || "Transaction failed");
    } finally {
      setIsMatching(false);
    }
  };

  const handleSettle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!signer || !address || !canEncrypt) {
      setError("Please connect wallet");
      return;
    }

    if (!matchId) {
      setError("No match ID available");
      return;
    }

    setIsSettling(true);

    try {
      const feeValue = Math.floor(parseFloat(feeAmount) * 1e18);

      const encrypted = await encryptWith((builder) => {
        builder.add64(feeValue);
      });

      const contract = new ethers.Contract(OTC_MARKETPLACE_ADDRESS, OTC_ABI, signer);

      const tx = await contract.executeSettlement(
        parseInt(matchId),
        encrypted.handles[0],
        encrypted.inputProof
      );

      await tx.wait();
      setMatchId("");
      setFeeAmount("");
    } catch (err: any) {
      setError(err.message || "Settlement failed");
    } finally {
      setIsSettling(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Match Orders</h3>
        <form onSubmit={handleMatch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Buy Order ID</label>
            <input
              type="number"
              value={buyOrderId}
              onChange={(e) => setBuyOrderId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sell Order ID</label>
            <input
              type="number"
              value={sellOrderId}
              onChange={(e) => setSellOrderId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fill Amount</label>
            <input
              type="number"
              step="0.000001"
              value={fillAmount}
              onChange={(e) => setFillAmount(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder="0.0"
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
              Transaction: {txHash.slice(0, 10)}...
              {matchId && <div className="mt-2">Match ID: {matchId}</div>}
            </div>
          )}

          <button
            type="submit"
            disabled={isMatching || !canEncrypt}
            className="w-full px-6 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-gray-500 text-white rounded-lg font-semibold transition-colors"
          >
            {isMatching ? "Matching..." : "Match Orders"}
          </button>
        </form>
      </div>

      {matchId && (
        <div className="border-t border-slate-700 pt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Settle Match</h3>
          <form onSubmit={handleSettle} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Match ID</label>
              <input
                type="text"
                value={matchId}
                disabled
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Fee Amount</label>
              <input
                type="number"
                step="0.000001"
                value={feeAmount}
                onChange={(e) => setFeeAmount(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="0.0"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSettling || !canEncrypt}
              className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-gray-500 text-white rounded-lg font-semibold transition-colors"
            >
              {isSettling ? "Settling..." : "Execute Settlement"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
