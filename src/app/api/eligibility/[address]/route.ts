import { NextRequest, NextResponse } from 'next/server';

const MOCK_ELIGIBLE_ADDRESSES: Record<string, { tier: string; landCount: number; creditAllocation: number }> = {
  '0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2': {
    tier: 'WHALE',
    landCount: 150,
    creditAllocation: 2500,
  },
  '0x86ef88559e9cad9274981b0256d15960c38476d3': {
    tier: 'SEED',
    landCount: 5,
    creditAllocation: 500,
  },
};

function hashAddress(address: string): number {
  let hash = 0;
  for (let i = 0; i < address.length; i++) hash = ((hash << 5) - hash + address.charCodeAt(i)) | 0;
  return hash;
}

function getDefaultEligibility(address: string) {
  const hash = Math.abs(hashAddress(address));
  const tierIndex = hash % 4;
  const tiers = ['SEED', 'CREATOR', 'ESTATE', 'WHALE'] as const;
  const tier = tiers[tierIndex];
  const tierAllocations: Record<string, number> = { SEED: 500, CREATOR: 1000, ESTATE: 1500, WHALE: 2500 };
  return { tier, landCount: (hash % 20) + 1, creditAllocation: tierAllocations[tier] };
}

export async function GET(request: NextRequest, { params }: { params: { address: string } }) {
  const { address } = params;
  if (!address || typeof address !== 'string') return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  const normalizedAddress = address.toLowerCase();
  const mockData = MOCK_ELIGIBLE_ADDRESSES[normalizedAddress] || getDefaultEligibility(address);
  return NextResponse.json({
    address,
    eligible: true,
    tier: mockData.tier,
    landCount: mockData.landCount,
    creditAllocation: mockData.creditAllocation,
    lastClaim: null,
  });
}