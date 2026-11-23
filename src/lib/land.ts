import type { EntitlementTier } from '@/lib/mock/types';

/**
 * Live LAND ownership reads.
 *
 * Contract verified on-chain 2026-11-23: name() = "Sandbox's LANDS",
 * symbol() = "LAND", ERC-721 on Polygon PoS. Address taken from a verified
 * on-chain read, not from memory. balanceOf() answers with a clean 32-byte
 * word for addresses that hold none, so the selector is live on this proxy.
 *
 * Everything here is a real read against Polygon. Nothing is derived from a
 * hash of the address, and no credit number is invented: the allocation lives
 * in the CognitionCreditDistributor contract, which is not deployed yet.
 */

export const LAND_CONTRACT_ADDRESS = '0x9d305a42A3975Ee4c1C57555BeD5919889DCE63F';
export const LAND_CHAIN_ID = 137;
export const LAND_CHAIN_NAME = 'Polygon';
export const LAND_CONTRACT_EXPLORER_URL = `https://polygonscan.com/token/${LAND_CONTRACT_ADDRESS}`;

/**
 * Public endpoints, tried in order. Verified reachable 2026-11-23.
 * polygon-rpc.com is deliberately absent: it now answers 401 "tenant disabled".
 */
const PUBLIC_RPC_URLS = [
  'https://polygon-bor-rpc.publicnode.com',
  'https://1rpc.io/matic',
  'https://polygon.drpc.org',
];

function rpcUrls(): string[] {
  const configured = process.env.NEXT_PUBLIC_POLYGON_RPC_URL;
  return configured ? [configured, ...PUBLIC_RPC_URLS] : PUBLIC_RPC_URLS;
}

export const TIER_BANDS: ReadonlyArray<{ tier: EntitlementTier; minLand: number }> = [
  { tier: 'WHALE', minLand: 200 },
  { tier: 'ESTATE', minLand: 50 },
  { tier: 'CREATOR', minLand: 10 },
  { tier: 'SEED', minLand: 1 },
];

export const CREDITS_NOT_LIVE_NOTE =
  'Credit amounts are set by the CognitionCreditDistributor contract, which is not deployed yet. No credit number is shown until it is.';

export interface LandReadResult {
  address: string;
  landCount: number;
  tier: EntitlementTier | null;
  eligible: boolean;
  blockNumber: number | null;
  contract: string;
  chainId: number;
  readAt: string;
}

const ADDRESS_PATTERN = /^0x[0-9a-fA-F]{40}$/;

export function isValidAddress(address: string): boolean {
  return ADDRESS_PATTERN.test(address.trim());
}

export function tierForLandCount(landCount: number): EntitlementTier | null {
  for (const band of TIER_BANDS) {
    if (landCount >= band.minLand) return band.tier;
  }
  return null;
}

function hexToNumber(value: string): number {
  if (typeof value !== 'string' || !value.startsWith('0x') || value.length <= 2) return 0;
  const parsed = Number.parseInt(value.slice(2), 16);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function rpcOnce<T>(url: string, method: string, params: unknown[]): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  if (!response.ok) {
    throw new Error(`Polygon RPC answered HTTP ${response.status}`);
  }
  const payload = (await response.json()) as { result?: T; error?: { message?: string } };
  if (payload.error) {
    throw new Error(payload.error.message ?? 'Polygon RPC returned an error');
  }
  if (payload.result === undefined) {
    throw new Error('Polygon RPC returned no result');
  }
  return payload.result;
}

async function rpc<T>(method: string, params: unknown[]): Promise<T> {
  let lastError: Error | null = null;
  for (const url of rpcUrls()) {
    try {
      return await rpcOnce<T>(url, method, params);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Polygon RPC call failed');
    }
  }
  throw lastError ?? new Error('No Polygon RPC endpoint answered');
}

export async function getLandBalance(address: string): Promise<LandReadResult> {
  const trimmed = address.trim();
  if (!isValidAddress(trimmed)) {
    throw new Error('That is not a valid 0x address.');
  }

  // balanceOf(address): selector 0x70a08231 + the address left-padded to 32 bytes
  const callData = `0x70a08231${trimmed.slice(2).toLowerCase().padStart(64, '0')}`;

  const [rawBalance, rawBlock] = await Promise.all([
    rpc<string>('eth_call', [{ to: LAND_CONTRACT_ADDRESS, data: callData }, 'latest']),
    rpc<string>('eth_blockNumber', []),
  ]);

  if (typeof rawBalance !== 'string' || !rawBalance.startsWith('0x')) {
    throw new Error('Polygon RPC returned an unreadable balance.');
  }

  const landCount = hexToNumber(rawBalance);

  return {
    address: trimmed,
    landCount,
    tier: tierForLandCount(landCount),
    eligible: landCount > 0,
    blockNumber: rawBlock ? hexToNumber(rawBlock) : null,
    contract: LAND_CONTRACT_ADDRESS,
    chainId: LAND_CHAIN_ID,
    readAt: new Date().toISOString(),
  };
}
