'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export const MOCK_BASE_SEPOLIA_ADDRESS = '0x86Ef88559E9cAD9274981b0256D15960C38476d3' as const;
export const MOCK_BASE_SEPOLIA_CHAIN_ID = 84532 as const;

const MOCK_WALLET_STORAGE_KEY = 'mock-wallet:base-sepolia-connection';
const MOCK_CONNECT_DELAY_MS = 500;

export type MockWalletStatus = 'disconnected' | 'connecting' | 'connected';

type MockWalletState =
  | { status: 'disconnected'; address: null; chainId: null }
  | { status: 'connecting'; address: null; chainId: null }
  | { status: 'connected'; address: string; chainId: number };

type PersistedMockWalletConnection = {
  isConnected: true;
  address: typeof MOCK_BASE_SEPOLIA_ADDRESS;
  chainId: typeof MOCK_BASE_SEPOLIA_CHAIN_ID;
};

export type UseMockWalletReturn = {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
};

const disconnectedState: MockWalletState = { status: 'disconnected', address: null, chainId: null };
const connectingState: MockWalletState = { status: 'connecting', address: null, chainId: null };

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function isPersistedMockWalletConnection(value: unknown): value is PersistedMockWalletConnection {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<PersistedMockWalletConnection>;
  return (
    candidate.isConnected === true &&
    candidate.address === MOCK_BASE_SEPOLIA_ADDRESS &&
    candidate.chainId === MOCK_BASE_SEPOLIA_CHAIN_ID
  );
}

function readPersistedConnection(): PersistedMockWalletConnection | null {
  if (!isBrowser()) return null;
  try {
    const rawValue = window.localStorage.getItem(MOCK_WALLET_STORAGE_KEY);
    if (!rawValue) return null;
    const parsedValue: unknown = JSON.parse(rawValue);
    return isPersistedMockWalletConnection(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

function persistConnection(): void {
  if (!isBrowser()) return;
  const connection: PersistedMockWalletConnection = {
    isConnected: true,
    address: MOCK_BASE_SEPOLIA_ADDRESS,
    chainId: MOCK_BASE_SEPOLIA_CHAIN_ID,
  };
  try {
    window.localStorage.setItem(MOCK_WALLET_STORAGE_KEY, JSON.stringify(connection));
  } catch {
    // localStorage can fail in restricted browsing contexts.
  }
}

function clearPersistedConnection(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(MOCK_WALLET_STORAGE_KEY);
  } catch {
    // localStorage can fail in restricted browsing contexts.
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function useMockWallet(): UseMockWalletReturn {
  const [state, setState] = useState<MockWalletState>(disconnectedState);
  const isMountedRef = useRef(false);
  const connectionAttemptRef = useRef(0);

  useEffect(() => {
    isMountedRef.current = true;
    const persistedConnection = readPersistedConnection();
    if (persistedConnection) {
      setState({
        status: 'connected',
        address: persistedConnection.address,
        chainId: persistedConnection.chainId,
      });
    }
    return () => {
      isMountedRef.current = false;
      connectionAttemptRef.current += 1;
    };
  }, []);

  const connect = useCallback(async (): Promise<void> => {
    const attemptId = connectionAttemptRef.current + 1;
    connectionAttemptRef.current = attemptId;
    setState(connectingState);
    await delay(MOCK_CONNECT_DELAY_MS);
    const isCurrentAttempt = connectionAttemptRef.current === attemptId;
    if (!isMountedRef.current || !isCurrentAttempt) return;
    persistConnection();
    setState({
      status: 'connected',
      address: MOCK_BASE_SEPOLIA_ADDRESS,
      chainId: MOCK_BASE_SEPOLIA_CHAIN_ID,
    });
  }, []);

  const disconnect = useCallback((): void => {
    connectionAttemptRef.current += 1;
    clearPersistedConnection();
    if (isMountedRef.current) {
      setState(disconnectedState);
    }
  }, []);

  return {
    address: state.address,
    chainId: state.chainId,
    isConnected: state.status === 'connected',
    isConnecting: state.status === 'connecting',
    connect,
    disconnect,
  };
}