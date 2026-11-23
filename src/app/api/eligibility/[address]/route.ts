import { NextRequest, NextResponse } from 'next/server';
import {
  CREDITS_NOT_LIVE_NOTE,
  LAND_CHAIN_NAME,
  LAND_CONTRACT_ADDRESS,
  getLandBalance,
  isValidAddress,
} from '@/lib/land';

// Reads the chain on every request. Nothing here is derived from the address.
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: { address: string } }) {
  const { address } = params;

  if (!address || typeof address !== 'string') {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  if (!isValidAddress(address)) {
    return NextResponse.json({ error: 'That is not a valid 0x address.' }, { status: 400 });
  }

  try {
    const read = await getLandBalance(address);
    return NextResponse.json({
      address: read.address,
      chain: LAND_CHAIN_NAME,
      chainId: read.chainId,
      contract: LAND_CONTRACT_ADDRESS,
      landCount: read.landCount,
      tier: read.tier,
      eligible: read.eligible,
      blockNumber: read.blockNumber,
      readAt: read.readAt,
      creditAllocation: null,
      creditAllocationNote: CREDITS_NOT_LIVE_NOTE,
      lastClaim: null,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Could not read Polygon right now.', detail },
      { status: 502 },
    );
  }
}
