import { type AuthNonceResponse, type AuthSessionResponse, type ClaimResponse, ClaimStatus, type ClaimTxResponse, type EligibilityResponse, type EntitlementTier, type EmissionCurveParams, type LastClaim } from './types';

export const DEFAULT_MOCK_CHAIN_ID = 84532;
export const MOCK_SESSION_COOKIE_NAME = 'land_mock_session';

// Tier-based seeded addresses with realistic credit amounts
export const MOCK_SEEDED_ADDRESSES = {
  SEED: [
    {
      address: '0xSEED10000000000000000000000000000000',
      tier: 'SEED' as EntitlementTier,
      baseAllocation: 500,
      activityMultiplier: 1.0,
    },
    {
      address: '0xSEED20000000000000000000000000000000',
      tier: 'SEED' as EntitlementTier,
      baseAllocation: 600,
      activityMultiplier: 1.2,
    },
  ],
  CREATOR: [
    {
      address: '0xCREATOR1000000000000000000000000000000',
      tier: 'CREATOR' as EntitlementTier,
      baseAllocation: 1000,
      activityMultiplier: 1.0,
    },
    {
      address: '0xCREATOR2000000000000000000000000000000',
      tier: 'CREATOR' as EntitlementTier,
      baseAllocation: 1200,
      activityMultiplier: 1.3,
    },
  ],
  ESTATE: [
    {
      address: '0xESTATE1000000000000000000000000000000',
      tier: 'ESTATE' as EntitlementTier,
      baseAllocation: 2500,
      activityMultiplier: 1.0,
    },
    {
      address: '0xESTATE2000000000000000000000000000000',
      tier: 'ESTATE' as EntitlementTier,
      baseAllocation: 3000,
      activityMultiplier: 1.4,
    },
  ],
  WHALE: [
    {
      address: '0xWHALE1000000000000000000000000000000',
      tier: 'WHALE' as EntitlementTier,
      baseAllocation: 10000,
      activityMultiplier: 1.0,
    },
    {
      address: '0xWHALE2000000000000000000000000000000',
      tier: 'WHALE' as EntitlementTier,
      baseAllocation: 15000,
      activityMultiplier: 1.5,
    },
  ],
  ineligible: '0xIneligible000000000000000000000000000000',
} as const;

// Emission curve parameters
const EMISSION_PARAMS: EmissionCurveParams = {
  delta: 0.05,
  baseDecayFactor: 0.95,
  maxDecayIterations: 100,
};

const NONCE_TTL_MS = 5 * 60 * 1000;
const MOCK_TIME_BASE_MS = Date.UTC(2025, 0, 1, 0, 0, 0);
const SEEDED_CLAIM_ID = 'mock-claim-seeded-eligible2';
const SEEDED_CLAIM_CREATED_AT = '2024-06-01T12:00:00.000Z';
const SEEDED_TX_HASH = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

export interface MockNonceRecord {
  nonce: string;
  address: string;
  normalizedAddress: string;
  expiresAt: number;
}

export interface MockSessionRecord extends AuthSessionResponse {
  cookieValue: string;
  createdAt: string;
  nonce?: string;
}

export interface MockClaimRecord {
  claimId: string;
  address: string;
  normalizedAddress: string;
  chainId: number;
  status: ClaimResponse['status'];
  createdAt: string;
  txHash?: string;
  message?: string;
}

const eligibilityStore = new Map<string, EligibilityResponse>();
const nonceStore = new Map<string, MockNonceRecord>();
const sessionStore = new Map<string, MockSessionRecord>();
const claimStore = new Map<string, MockClaimRecord>();
let nonceCounter = 0;
let sessionCounter = 0;
let claimCounter = 0;
let activeSessionCookieValue: string | undefined;

// Initialize seeded eligibility records
for (const tier of ['SEED', 'CREATOR', 'ESTATE', 'WHALE'] as const) {
  for (const seeded of MOCK_SEEDED_ADDRESSES[tier]) {
    const eligibility: EligibilityResponse = {
      address: seeded.address,
      eligible: true,
      entitlementCredits: calculateEntitlementCredits(
        seeded.baseAllocation,
        seeded.activityMultiplier,
        seeded.tier,
      ),
      claimableCredits: calculateEntitlementCredits(
        seeded.baseAllocation,
        seeded.activityMultiplier,
        seeded.tier,
      ),
      claimedCredits: 0,
      status: ClaimStatus.Unclaimed,
      tier: seeded.tier,
      activityMultiplier: seeded.activityMultiplier,
      emissionDecayFactor: getEmissionDecayFactor(0),
    };
    eligibilityStore.set(normalizeMockAddress(seeded.address), eligibility);
  }
}

// Add ineligible address
const ineligibleEligibility: EligibilityResponse = {
  address: MOCK_SEEDED_ADDRESSES.ineligible,
  eligible: false,
  entitlementCredits: 0,
  claimableCredits: 0,
  claimedCredits: 0,
  status: ClaimStatus.Ineligible,
};
eligibilityStore.set(
  normalizeMockAddress(MOCK_SEEDED_ADDRESSES.ineligible),
  ineligibleEligibility,
);

// Add seeded claimed address
const claimedEligibility: EligibilityResponse = {
  address: MOCK_SEEDED_ADDRESSES.CREATOR[0].address,
  eligible: true,
  entitlementCredits: 1000,
  claimableCredits: 0,
  claimedCredits: 200,
  status: ClaimStatus.Claimed,
  tier: 'CREATOR',
  activityMultiplier: 1.0,
  emissionDecayFactor: getEmissionDecayFactor(0),
  lastClaim: {
    claimId: SEEDED_CLAIM_ID,
    createdAt: SEEDED_CLAIM_CREATED_AT,
    txHash: SEEDED_TX_HASH,
  },
};
eligibilityStore.set(
  normalizeMockAddress(MOCK_SEEDED_ADDRESSES.CREATOR[0].address),
  claimedEligibility,
);
claimStore.set(SEEDED_CLAIM_ID, {
  claimId: SEEDED_CLAIM_ID,
  address: MOCK_SEEDED_ADDRESSES.CREATOR[0].address,
  normalizedAddress: normalizeMockAddress(MOCK_SEEDED_ADDRESSES.CREATOR[0].address),
  chainId: DEFAULT_MOCK_CHAIN_ID,
  status: ClaimStatus.Claimed,
  createdAt: SEEDED_CLAIM_CREATED_AT,
  txHash: SEEDED_TX_HASH,
});

export function normalizeMockAddress(address: string): string {
  return address.trim().toLowerCase();
}

export function calculateEntitlementCredits(
  baseAllocation: number,
  activityMultiplier: number,
  tier: EntitlementTier,
): number {
  const tierWeight = getTierWeight(tier);
  const decayFactor = getEmissionDecayFactor(0);
  return Math.floor(baseAllocation * activityMultiplier * tierWeight * decayFactor);
}

export function getTierWeight(tier: EntitlementTier): number {
  switch (tier) {
    case 'SEED': return 1.0;
    case 'CREATOR': return 1.5;
    case 'ESTATE': return 2.5;
    case 'WHALE': return 5.0;
    default: return 1.0;
  }
}

export function getEmissionDecayFactor(iterations: number): number {
  return Math.pow(EMISSION_PARAMS.baseDecayFactor, iterations);
}

export function getMockEligibility(address: string): EligibilityResponse {
  return cloneEligibility(ensureEligibilityRecord(address));
}

export function createMockNonce(address: string): AuthNonceResponse {
  const now = Date.now();
  const trimmedAddress = address.trim();
  const normalizedAddress = normalizeMockAddress(trimmedAddress);
  pruneExpiredNonces(now);
  nonceCounter += 1;
  const noncePrefix = normalizedAddress.slice(2, 10) || 'wallet';
  const nonce = `land-mock-${noncePrefix}-${nonceCounter.toString(36).padStart(4, '0')}`;
  nonceStore.set(nonce, {
    nonce,
    address: trimmedAddress,
    normalizedAddress,
    expiresAt: now + NONCE_TTL_MS,
  });
  return { nonce };
}

export function consumeMockNonce(message: string): MockNonceRecord | undefined {
  pruneExpiredNonces(Date.now());
  for (const [nonce, record] of nonceStore.entries()) {
    if (message.includes(nonce)) {
      nonceStore.delete(nonce);
      return { ...record };
    }
  }
  return undefined;
}

export function createMockSession(
  address: string,
  chainId: number,
  nonce?: string,
): MockSessionRecord {
  sessionCounter += 1;
  const cookieValue = `land-mock-session-${sessionCounter.toString(36).padStart(4, '0')}`;
  const createdAt = timestampForSequence(sessionCounter);
  const trimmedAddress = address.trim();
  const session: MockSessionRecord = nonce === undefined
    ? { cookieValue, address: trimmedAddress, chainId, createdAt }
    : { cookieValue, address: trimmedAddress, chainId, createdAt, nonce };
  sessionStore.set(cookieValue, session);
  if (nonce !== undefined) {
    sessionStore.set(nonce, session);
  }
  activeSessionCookieValue = cookieValue;
  return { ...session };
}

export function getMockSession(cookieValue?: string): AuthSessionResponse | undefined {
  const key = cookieValue ?? activeSessionCookieValue;
  if (key === undefined) return undefined;
  const session = sessionStore.get(key);
  if (session === undefined) return undefined;
  return { address: session.address, chainId: session.chainId };
}

export function getActiveMockSessionCookieValue(): string | undefined {
  return activeSessionCookieValue;
}

export function createMockClaim(address: string, chainId: number): ClaimResponse {
  const eligibility = ensureEligibilityRecord(address);
  const normalizedAddress = normalizeMockAddress(address);
  if (!eligibility.eligible || eligibility.status === ClaimStatus.Ineligible) {
    return createRejectedClaim(address, chainId, 'Address is not eligible');
  }
  if (eligibility.status === ClaimStatus.Claimed || eligibility.claimableCredits <= 0) {
    return createRejectedClaim(address, chainId, 'No credits available to claim');
  }
  claimCounter += 1;
  const claimId = `mock-claim-${claimCounter.toString(36).padStart(4, '0')}`;
  const createdAt = timestampForSequence(claimCounter);
  const claim: MockClaimRecord = {
    claimId,
    address: address.trim(),
    normalizedAddress,
    chainId,
    status: 'pending',
    createdAt,
  };
  claimStore.set(claimId, claim);
  eligibility.status = ClaimStatus.Pending;
  eligibility.claimableCredits = 0;
  return { claimId, status: 'pending', message: 'Claim submitted' };
}

function createRejectedClaim(address: string, chainId: number, message: string): ClaimResponse {
  return { claimId: '', status: 'rejected', message };
}

function ensureEligibilityRecord(address: string): EligibilityResponse {
  const normalizedAddress = normalizeMockAddress(address);
  const existing = eligibilityStore.get(normalizedAddress);
  if (existing) return existing;
  return createFallbackEligibility(address);
}

function createFallbackEligibility(address: string): EligibilityResponse {
  const addressHash = simpleHash(address);
  const tierOptions: EntitlementTier[] = ['SEED', 'CREATOR', 'ESTATE', 'WHALE'];
  const tierIndex = addressHash % tierOptions.length;
  const tier = tierOptions[tierIndex];
  const baseAllocations: Record<string, number> = {
    SEED: 500, CREATOR: 1000, ESTATE: 2500, WHALE: 10000,
  };
  const activityMultiplier = 0.8 + (addressHash % 100) / 100 * 0.4;
  const baseAllocation = baseAllocations[tier];
  const entitlementCredits = calculateEntitlementCredits(baseAllocation, activityMultiplier, tier);
  const eligibility: EligibilityResponse = {
    address: address.trim(),
    eligible: true,
    entitlementCredits,
    claimableCredits: entitlementCredits,
    claimedCredits: 0,
    status: ClaimStatus.Unclaimed,
    tier,
    activityMultiplier,
    emissionDecayFactor: getEmissionDecayFactor(0),
  };
  eligibilityStore.set(normalizeMockAddress(address.trim()), eligibility);
  return eligibility;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function cloneEligibility(e: EligibilityResponse): EligibilityResponse {
  return { ...e, lastClaim: e.lastClaim ? { ...e.lastClaim } : undefined };
}

function pruneExpiredNonces(now: number): void {
  for (const [nonce, record] of nonceStore.entries()) {
    if (record.expiresAt < now) nonceStore.delete(nonce);
  }
}

function timestampForSequence(seq: number): string {
  return new Date(MOCK_TIME_BASE_MS + seq * 1000).toISOString();
}