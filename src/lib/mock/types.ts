export interface AuthNonceResponse {
  nonce: string;
}

export interface AuthVerifyRequest {
  message: string;
  signature: string;
}

export interface AuthVerifyResponse {
  address: string;
  chainId: number;
}

export interface AuthSessionResponse {
  address: string;
  chainId: number;
}

export enum ClaimStatus {
  Ineligible = 'ineligible',
  Unclaimed = 'unclaimed',
  Pending = 'pending',
  Claimed = 'claimed',
  Rejected = 'rejected',
}

export type EligibilityStatus = 'ineligible' | 'unclaimed' | 'pending' | 'claimed';

export interface LastClaim {
  claimId?: string;
  createdAt?: string;
  txHash?: string;
}

export interface EligibilityResponse {
  address: string;
  eligible: boolean;
  entitlementCredits: number;
  claimableCredits: number;
  claimedCredits: number;
  status: EligibilityStatus;
  lastClaim?: LastClaim;
  tier?: 'SEED' | 'CREATOR' | 'ESTATE' | 'WHALE';
  activityMultiplier?: number;
  emissionDecayFactor?: number;
}

export type EntitlementTier = 'SEED' | 'CREATOR' | 'ESTATE' | 'WHALE';

export interface EmissionCurveParams {
  delta: number;
  baseDecayFactor: number;
  maxDecayIterations: number;
}

export interface ClaimRequest {
  address: string;
  chainId: number;
  claimSignature?: string;
}

export type ClaimResponseStatus = 'pending' | 'claimed' | 'rejected';

export interface ClaimResponse {
  claimId: string;
  status: ClaimResponseStatus;
  message?: string;
}

export interface ClaimTxRequest {
  address: string;
  chainId: number;
  txHash: string;
  claimId?: string;
}

export interface ClaimTxResponse {
  status: 'recorded';
}

export interface AdminUploadError {
  row: number;
  message: string;
}

export interface AdminUploadResponse {
  importedCount: number;
  rejectedCount: number;
  errors?: AdminUploadError[];
}

export enum MockWalletState {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected',
}