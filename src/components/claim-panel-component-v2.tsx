'use client';

import React from 'react';
import styled from 'styled-components';

const Panel = styled.div`
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
`;

const ClaimButton = styled.button`
  min-height: 48px;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #22c55e 0%, #7dd3fc 100%);
  color: #071018;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-2px);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

type ClaimPanelProps = {
  address: string | null;
  eligibility: {
    tier: string;
    creditAllocation: number;
    status: string;
  };
  onClaimSuccess?: (txHash: string) => void;
  onClaimError?: (error: string) => void;
};

export default function ClaimPanel({
  address,
  eligibility,
  onClaimSuccess,
  onClaimError,
}: ClaimPanelProps) {
  const [claiming, setClaiming] = React.useState(false);

  const handleClaim = async () => {
    if (!address) return;
    setClaiming(true);
    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      });
      if (!res.ok) {
        onClaimError?.(`Claim API returned ${res.status}. No transaction was sent.`);
        return;
      }
      const data: unknown = await res.json();
      const returnedHash =
        typeof data === 'object' && data !== null
          ? (data as { txHash?: unknown }).txHash
          : undefined;
      if (typeof returnedHash === 'string' && returnedHash.length > 0) {
        onClaimSuccess?.(returnedHash);
        return;
      }
      onClaimError?.('Claim failed. No transaction was sent.');
    } catch {
      // Static hosting has no /api/claim route. Never synthesize a success here:
      // a claim only counts when the server returns a real transaction hash.
      onClaimError?.(
        'Claim service is not live yet. No transaction was sent and no credits moved.',
      );
    } finally {
      setClaiming(false);
    }
  };

  return (
    <Panel>
      <p>Tier: {eligibility.tier}</p>
      <p>
        Credits:{' '}
        {eligibility.creditAllocation > 0
          ? eligibility.creditAllocation
          : 'not set yet, the distributor contract is not deployed'}
      </p>
      <ClaimButton onClick={handleClaim} disabled={claiming || !address}>
        {claiming ? 'Claiming...' : 'Claim Credits'}
      </ClaimButton>
    </Panel>
  );
}
