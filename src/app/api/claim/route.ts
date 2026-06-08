import { NextRequest, NextResponse } from 'next/server';
import { createMockClaim, DEFAULT_MOCK_CHAIN_ID } from '@/lib/mock/mock-data';
import { type ClaimResponse } from '@/lib/mock/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, chainId = DEFAULT_MOCK_CHAIN_ID } = body;

    if (!walletAddress || typeof walletAddress !== 'string') {
      return NextResponse.json({ error: 'walletAddress is required' }, { status: 400 });
    }

    const claimResponse: ClaimResponse = createMockClaim(walletAddress, chainId);

    if (claimResponse.status === 'rejected') {
      return NextResponse.json({ error: claimResponse.message || 'Claim rejected' }, { status: 400 });
    }

    const mockTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    return NextResponse.json({
      claimId: claimResponse.claimId,
      status: claimResponse.status,
      txHash: mockTxHash,
      message: claimResponse.message,
    });
  } catch (error) {
    console.error('Claim API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}