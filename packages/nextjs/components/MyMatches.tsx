"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { useEthersSigner } from "../hooks/useEthersSigner";

const OTC_MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_OTC_MARKETPLACE_ADDRESS || "";

const OTC_ABI = [
  "function getUserMatches(address user) external view returns (uint256[])",
  "function getMatch(uint256 matchId) external view returns (uint256, uint256, uint256, tuple(bytes,bytes), tuple(bytes,bytes), uint256, address, address)"
];

interface Match {
  matchId: number;
  buyOrderId: number;
  sellOrderId: number;
  timestamp: number;
  buyer: string;
  seller: string;
}

export function MyMatches() {
  const { address } = useAccount();
  const signer = useEthersSigner();
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadMyMatches = async () => {
    if (!signer || !address) return;

    setIsLoading(true);
    try {
      const contract = new ethers.Contract(OTC_MARKETPLACE_ADDRESS, OTC_ABI, signer);
      const matchIds = await contract.getUserMatches(address);

      const matchPromises = matchIds.map(async (id: bigint) => {
        try {
          const result = await contract.getMatch(Number(id));
          return {
            matchId: Number(id),
            buyOrderId: Number(result[1]),
            sellOrderId: Number(result[2]),
            timestamp: Number(result[5]),
            buyer: result[6],
            seller: result[7]
          };
        } catch {
          return null;
        }
      });

      const results = await Promise.all(matchPromises);
      setMatches(results.filter((match): match is Match => match !== null));
    } catch (err) {
      console.error("Failed to load matches", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMyMatches();
  }, [signer, address]);

  if (isLoading) {
    return <div className="text-center py-12 text-gray-400">Loading your matches...</div>;
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">You have no matches yet</p>
        <a
          href="/trade"
          className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
        >
          Start Trading
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Your Matches ({matches.length})</h3>
        <button
          onClick={loadMyMatches}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
        >
          Refresh
        </button>
      </div>

      {matches.map((match) => (
        <div
          key={match.matchId}
          className="bg-slate-700/50 border border-slate-600 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-500/20 text-purple-400">
                MATCH
              </span>
              <span className="text-gray-400 text-sm">Match #{match.matchId}</span>
            </div>
            <div className="text-sm text-gray-400">
              {new Date(match.timestamp * 1000).toLocaleDateString()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Buy Order ID:</span>
              <div className="text-white font-semibold">#{match.buyOrderId}</div>
            </div>
            <div>
              <span className="text-gray-400">Sell Order ID:</span>
              <div className="text-white font-semibold">#{match.sellOrderId}</div>
            </div>
            <div>
              <span className="text-gray-400">Buyer:</span>
              <div className="text-white font-mono text-xs">
                {match.buyer.slice(0, 10)}...{match.buyer.slice(-8)}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Seller:</span>
              <div className="text-white font-mono text-xs">
                {match.seller.slice(0, 10)}...{match.seller.slice(-8)}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Your Role:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  match.buyer.toLowerCase() === address?.toLowerCase()
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {match.buyer.toLowerCase() === address?.toLowerCase() ? "BUYER" : "SELLER"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
