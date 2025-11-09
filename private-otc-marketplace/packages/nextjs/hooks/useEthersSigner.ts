import { useMemo } from "react";
import { useWalletClient } from "wagmi";
import { ethers } from "ethers";

export function walletClientToSigner(walletClient: any) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new ethers.BrowserProvider(transport, network);
  const signer = new ethers.JsonRpcSigner(provider, account.address);
  return signer;
}

export function useEthersSigner() {
  const { data: walletClient } = useWalletClient();

  return useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  );
}
