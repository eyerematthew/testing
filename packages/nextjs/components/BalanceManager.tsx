"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useFHEEncryption, useFHEDecrypt } from "@fhevm-sdk/react";
import { useEthersSigner } from "../hooks/useEthersSigner";
import { ethers } from "ethers";

const OTC_MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_OTC_MARKETPLACE_ADDRESS || "";

const OTC_ABI = [
  "function deposit(address asset, tuple(bytes,bytes) amount, bytes inputProof) external",
  "function withdraw(address asset, tuple(bytes,bytes) amount, bytes inputProof) external",
  "function getBalance(address user, address asset) external view returns (tuple(bytes,bytes))"
];

export function BalanceManager() {
  const { address } = useAccount();
  const signer = useEthersSigner();
  const { canEncrypt, encryptWith } = useFHEEncryption();

  const [action, setAction] = useState<"deposit" | "withdraw">("deposit");
  const [assetAddress, setAssetAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  const [balanceAsset, setBalanceAsset] = useState("");
  const [encryptedBalance, setEncryptedBalance] = useState<any>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const { decryptedValue, isDecrypting } = useFHEDecrypt(
    encryptedBalance,
    OTC_MARKETPLACE_ADDRESS
  );

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

      const encrypted = await encryptWith((builder) => {
        builder.add64(amountValue);
      });

      const contract = new ethers.Contract(OTC_MARKETPLACE_ADDRESS, OTC_ABI, signer);

      const tx = action === "deposit"
        ? await contract.deposit(assetAddress, encrypted.handles[0], encrypted.inputProof)
        : await contract.withdraw(assetAddress, encrypted.handles[0], encrypted.inputProof);

      setTxHash(tx.hash);
      await tx.wait();

      setAssetAddress("");
      setAmount("");
    } catch (err: any) {
      setError(err.message || "Transaction failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckBalance = async () => {
    if (!signer || !address || !ethers.isAddress(balanceAsset)) {
      setError("Invalid asset address");
      return;
    }

    setIsLoadingBalance(true);
    setError("");

    try {
      const contract = new ethers.Contract(OTC_MARKETPLACE_ADDRESS, OTC_ABI, signer);
      const balance = await contract.getBalance(address, balanceAsset);
      setEncryptedBalance(balance);
    } catch (err: any) {
      setError(err.message || "Failed to load balance");
    } finally {
      setIsLoadingBalance(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-8">
        <h3 className="text-xl font-semibold text-white mb-6">Manage Balance</h3>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setAction("deposit")}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
              action === "deposit"
                ? "bg-green-600 text-white"
                : "bg-slate-700 text-gray-400 hover:text-white"
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setAction("withdraw")}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
              action === "withdraw"
                ? "bg-red-600 text-white"
                : "bg-slate-700 text-gray-400 hover:text-white"
            }`}
          >
            Withdraw
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

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {txHash && (
            <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-400">
              Transaction: {txHash.slice(0, 10)}...
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !canEncrypt}
            className="w-full px-6 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-gray-500 text-white rounded-lg font-semibold transition-colors"
          >
            {isSubmitting ? "Processing..." : action === "deposit" ? "Deposit" : "Withdraw"}
          </button>
        </form>
      </div>

      <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-8">
        <h3 className="text-xl font-semibold text-white mb-6">Check Balance</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Asset Address</label>
            <input
              type="text"
              value={balanceAsset}
              onChange={(e) => setBalanceAsset(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder="0x..."
            />
          </div>

          <button
            onClick={handleCheckBalance}
            disabled={isLoadingBalance}
            className="w-full px-6 py-4 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-gray-500 text-white rounded-lg font-semibold transition-colors"
          >
            {isLoadingBalance ? "Loading..." : "Check Balance"}
          </button>

          {encryptedBalance && (
            <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">Balance:</div>
              {isDecrypting ? (
                <div className="text-white">Decrypting...</div>
              ) : decryptedValue !== undefined ? (
                <div className="text-2xl font-bold text-white">
                  {(Number(decryptedValue) / 1e18).toFixed(6)}
                </div>
              ) : (
                <div className="text-gray-400">Click to decrypt</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
