'use client';

import { useMockWallet as useBaseMockWallet } from '@/lib/mock/mock-wallet';

export function useMockWallet() {
  const base = useBaseMockWallet();
  return {
    address: base.address,
    chainId: base.chainId,
    isConnected: base.isConnected,
    isConnecting: base.isConnecting,
    connectWallet: base.connect,
    disconnectWallet: base.disconnect,
  };
}