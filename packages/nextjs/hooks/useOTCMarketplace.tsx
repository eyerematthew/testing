import { useCallback, useState, useMemo } from "react";
import { useFhevm } from "@fhevm-sdk";
import { ethers } from "ethers";
import { useFHEEncryption, useFHEDecrypt, useInMemoryStorage } from "@fhevm-sdk";

export const useOTCMarketplace = (parameters: {
  instance: any;
  ethersSigner: ethers.JsonRpcSigner | undefined;
  contractAddress: `0x${string}` | undefined;
  chainId: number | undefined;
}) => {
  const { instance, ethersSigner, contractAddress, chainId } = parameters;
  const { storage } = useInMemoryStorage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const { encryptWith, canEncrypt } = useFHEEncryption({
    instance,
    ethersSigner,
    contractAddress,
  });

  const createOrder = useCallback(
    async (
      assetAddress: string,
      amount: number,
      price: number,
      minFillAmount: number,
      isBuy: boolean,
      expirationDays: number
    ) => {
      if (!canEncrypt || !ethersSigner || !contractAddress) {
        setMessage("Cannot create order: not ready");
        return;
      }

      setIsProcessing(true);
      setMessage("Encrypting order parameters...");

      try {
        const enc = await encryptWith((builder) => {
          builder.add64(amount);
          builder.add64(price);
          builder.add64(minFillAmount);
          builder.addBool(isBuy);
        });

        if (!enc) {
          setMessage("Encryption failed");
          return;
        }

        setMessage("Creating order transaction...");
        const contract = new ethers.Contract(
          contractAddress,
          [
            "function createOrder(address,bytes32,bytes32,bytes32,bytes,bytes32,uint256) external returns (uint256)",
          ],
          ethersSigner
        );

        const expirationTime = Math.floor(Date.now() / 1000) + expirationDays * 86400;
        const tx = await contract.createOrder(
          assetAddress,
          enc.handles[0],
          enc.handles[1],
          enc.handles[2],
          "0x" + Buffer.from(enc.inputProof).toString("hex"),
          enc.handles[3],
          expirationTime
        );

        setMessage("Waiting for confirmation...");
        await tx.wait();
        setMessage("Order created successfully!");

        return tx;
      } catch (error: any) {
        setMessage(`Error: ${error.message}`);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [canEncrypt, ethersSigner, contractAddress, encryptWith]
  );

  const matchOrders = useCallback(
    async (buyOrderId: number, sellOrderId: number, fillAmount: number) => {
      if (!canEncrypt || !ethersSigner || !contractAddress) {
        setMessage("Cannot match orders: not ready");
        return;
      }

      setIsProcessing(true);
      setMessage("Encrypting fill amount...");

      try {
        const enc = await encryptWith((builder) => {
          builder.add64(fillAmount);
        });

        if (!enc) {
          setMessage("Encryption failed");
          return;
        }

        setMessage("Matching orders...");
        const contract = new ethers.Contract(
          contractAddress,
          ["function matchOrders(uint256,uint256,bytes32,bytes) external returns (uint256)"],
          ethersSigner
        );

        const tx = await contract.matchOrders(
          buyOrderId,
          sellOrderId,
          enc.handles[0],
          "0x" + Buffer.from(enc.inputProof).toString("hex")
        );

        setMessage("Waiting for confirmation...");
        await tx.wait();
        setMessage("Orders matched successfully!");

        return tx;
      } catch (error: any) {
        setMessage(`Error: ${error.message}`);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [canEncrypt, ethersSigner, contractAddress, encryptWith]
  );

  const executeSettlement = useCallback(
    async (matchId: number) => {
      if (!ethersSigner || !contractAddress) {
        setMessage("Cannot settle: not ready");
        return;
      }

      setIsProcessing(true);
      setMessage("Executing settlement...");

      try {
        const contract = new ethers.Contract(
          contractAddress,
          ["function executeSettlement(uint256) external"],
          ethersSigner
        );

        const tx = await contract.executeSettlement(matchId);
        setMessage("Waiting for confirmation...");
        await tx.wait();
        setMessage("Settlement executed successfully!");

        return tx;
      } catch (error: any) {
        setMessage(`Error: ${error.message}`);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [ethersSigner, contractAddress]
  );

  const cancelOrder = useCallback(
    async (orderId: number) => {
      if (!ethersSigner || !contractAddress) {
        setMessage("Cannot cancel: not ready");
        return;
      }

      setIsProcessing(true);
      setMessage("Cancelling order...");

      try {
        const contract = new ethers.Contract(
          contractAddress,
          ["function cancelOrder(uint256) external"],
          ethersSigner
        );

        const tx = await contract.cancelOrder(orderId);
        setMessage("Waiting for confirmation...");
        await tx.wait();
        setMessage("Order cancelled successfully!");

        return tx;
      } catch (error: any) {
        setMessage(`Error: ${error.message}`);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [ethersSigner, contractAddress]
  );

  const deposit = useCallback(
    async (assetAddress: string, amount: number) => {
      if (!canEncrypt || !ethersSigner || !contractAddress) {
        setMessage("Cannot deposit: not ready");
        return;
      }

      setIsProcessing(true);
      setMessage("Encrypting deposit amount...");

      try {
        const enc = await encryptWith((builder) => {
          builder.add64(amount);
        });

        if (!enc) {
          setMessage("Encryption failed");
          return;
        }

        setMessage("Depositing...");
        const contract = new ethers.Contract(
          contractAddress,
          ["function deposit(address,bytes32,bytes) external"],
          ethersSigner
        );

        const tx = await contract.deposit(
          assetAddress,
          enc.handles[0],
          "0x" + Buffer.from(enc.inputProof).toString("hex")
        );

        setMessage("Waiting for confirmation...");
        await tx.wait();
        setMessage("Deposit successful!");

        return tx;
      } catch (error: any) {
        setMessage(`Error: ${error.message}`);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [canEncrypt, ethersSigner, contractAddress, encryptWith]
  );

  return {
    createOrder,
    matchOrders,
    executeSettlement,
    cancelOrder,
    deposit,
    isProcessing,
    message,
    canEncrypt,
  };
};
