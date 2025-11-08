import { useState, useMemo } from "react";
import { useFhevm } from "@fhevm-sdk";
import { useAccount } from "wagmi";
import { useOTCMarketplace } from "../hooks/useOTCMarketplace";
import { ethers } from "ethers";

export const OTCTradingInterface = () => {
  const { isConnected, chain } = useAccount();
  const [assetAddress, setAssetAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [minFillAmount, setMinFillAmount] = useState("");
  const [isBuy, setIsBuy] = useState(true);
  const [expirationDays, setExpirationDays] = useState(7);
  const [buyOrderId, setBuyOrderId] = useState("");
  const [sellOrderId, setSellOrderId] = useState("");
  const [fillAmount, setFillAmount] = useState("");
  const [matchId, setMatchId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [depositAsset, setDepositAsset] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  const chainId = chain?.id;

  const provider = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return (window as any).ethereum;
  }, []);

  const initialMockChains = { 31337: "http://localhost:8545" };

  const { instance: fhevmInstance, status: fhevmStatus } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true,
  });

  const ethersSigner = useMemo(() => {
    if (!provider) return undefined;
    const ethersProvider = new ethers.BrowserProvider(provider);
    return ethersProvider.getSigner();
  }, [provider]);

  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3" as `0x${string}`;

  const {
    createOrder,
    matchOrders,
    executeSettlement,
    cancelOrder,
    deposit,
    isProcessing,
    message,
    canEncrypt,
  } = useOTCMarketplace({
    instance: fhevmInstance,
    ethersSigner: ethersSigner as any,
    contractAddress: CONTRACT_ADDRESS,
    chainId,
  });

  const handleCreateOrder = async () => {
    if (!amount || !price || !minFillAmount || !assetAddress) {
      alert("Fill all fields");
      return;
    }
    await createOrder(
      assetAddress,
      parseInt(amount),
      parseInt(price),
      parseInt(minFillAmount),
      isBuy,
      expirationDays
    );
  };

  const handleMatchOrders = async () => {
    if (!buyOrderId || !sellOrderId || !fillAmount) {
      alert("Fill all fields");
      return;
    }
    await matchOrders(parseInt(buyOrderId), parseInt(sellOrderId), parseInt(fillAmount));
  };

  const handleExecuteSettlement = async () => {
    if (!matchId) {
      alert("Enter match ID");
      return;
    }
    await executeSettlement(parseInt(matchId));
  };

  const handleCancelOrder = async () => {
    if (!orderId) {
      alert("Enter order ID");
      return;
    }
    await cancelOrder(parseInt(orderId));
  };

  const handleDeposit = async () => {
    if (!depositAsset || !depositAmount) {
      alert("Fill all fields");
      return;
    }
    await deposit(depositAsset, parseInt(depositAmount));
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Wallet</h2>
          <p className="text-gray-300">Please connect your wallet to access the OTC marketplace</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Private OTC Marketplace</h1>
          <p className="text-gray-400 mb-4">Fully Encrypted Over-the-Counter Trading</p>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-gray-400">FHEVM Status:</span>
              <span className={`ml-2 ${fhevmStatus === "ready" ? "text-green-400" : "text-yellow-400"}`}>
                {fhevmStatus}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Network:</span>
              <span className="ml-2 text-white">{chain?.name}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Create Order</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Asset Address"
                value={assetAddress}
                onChange={(e) => setAssetAddress(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Min Fill Amount"
                value={minFillAmount}
                onChange={(e) => setMinFillAmount(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded"
              />
              <select
                value={isBuy ? "buy" : "sell"}
                onChange={(e) => setIsBuy(e.target.value === "buy")}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded"
              >
                <option value="buy">Buy Order</option>
                <option value="sell">Sell Order</option>
              </select>
              <input
                type="number"
                placeholder="Expiration (days)"
                value={expirationDays}
                onChange={(e) => setExpirationDays(parseInt(e.target.value))}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded"
              />
              <button
                onClick={handleCreateOrder}
                disabled={isProcessing || !canEncrypt}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded transition"
              >
                {isProcessing ? "Processing..." : "Create Order"}
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Match Orders</h2>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Buy Order ID"
                value={buyOrderId}
                onChange={(e) => setBuyOrderId(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Sell Order ID"
                value={sellOrderId}
                onChange={(e) => setSellOrderId(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Fill Amount"
                value={fillAmount}
                onChange={(e) => setFillAmount(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded"
              />
              <button
                onClick={handleMatchOrders}
                disabled={isProcessing || !canEncrypt}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded transition"
              >
                {isProcessing ? "Processing..." : "Match Orders"}
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Settle Match</h2>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Match ID"
                value={matchId}
                onChange={(e) => setMatchId(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded"
              />
              <button
                onClick={handleExecuteSettlement}
                disabled={isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded transition"
              >
                {isProcessing ? "Processing..." : "Execute Settlement"}
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Cancel Order</h2>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded"
              />
              <button
                onClick={handleCancelOrder}
                disabled={isProcessing}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded transition"
              >
                {isProcessing ? "Processing..." : "Cancel Order"}
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-xl p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">Deposit Funds</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Asset Address"
                value={depositAsset}
                onChange={(e) => setDepositAsset(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              />
              <button
                onClick={handleDeposit}
                disabled={isProcessing || !canEncrypt}
                className="md:col-span-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded transition"
              >
                {isProcessing ? "Processing..." : "Deposit"}
              </button>
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-6 bg-gray-800 rounded-lg shadow-xl p-4">
            <p className="text-white">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};
