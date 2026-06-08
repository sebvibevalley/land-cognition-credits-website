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

export default function ClaimPanel({ address, eligibility, onClaimSuccess, onClaimError }: ClaimPanelProps) {
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
      const data = await res.json();
      if (data.txHash) {
        onClaimSuccess?.(data.txHash);
      } else {
        onClaimError?.(data.error || 'Claim failed');
      }
    } catch (err) {
      onClaimError?.(String(err));
    } finally {
      setClaiming(false);
    }
  };

  return (
    <Panel>
      <p>Tier: {eligibility.tier}</p>
      <p>Credits: {eligibility.creditAllocation}</p>
      <ClaimButton onClick={handleClaim} disabled={claiming || !address}>
        {claiming ? 'Claiming...' : 'Claim Credits'}
      </ClaimButton>
    </Panel>
  );
}