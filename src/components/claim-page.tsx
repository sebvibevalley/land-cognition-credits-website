'use client';

import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import Layout from '@/components/layout';
import { useMockWallet } from '@/lib/mock/mock-wallet';
import ClaimPanel from '@/components/claim-panel-component-v2';
import { getMockEligibility } from '@/lib/mock/mock-data';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem;
  color: #f8fafc;
`;

const PageDescription = styled.p`
  font-size: 1.1rem;
  color: #94a3b8;
  margin: 0 0 2rem;
  line-height: 1.6;
`;

const DemoNotice = styled.p`
  margin: 0 0 2rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.24);
`;

const MockData = styled.div`
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  margin-bottom: 2rem;
`;

const MockLabel = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ConnectButton = styled.button`
  margin-top: 1rem;
  min-height: 44px;
  padding: 0.6rem 1.25rem;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #22c55e 0%, #7dd3fc 100%);
  color: #071018;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ConnectedAddress = styled.code`
  display: block;
  margin-top: 0.75rem;
  color: #7dd3fc;
  font-size: 0.875rem;
  word-break: break-all;
`;

const StatusBox = styled.div<{ $ok: boolean }>`
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 10px;
  font-size: 0.95rem;
  line-height: 1.5;
  word-break: break-all;
  color: ${(props) => (props.$ok ? '#00FF7A' : '#fbbf24')};
  background: ${(props) =>
    props.$ok ? 'rgba(0, 255, 122, 0.1)' : 'rgba(251, 191, 36, 0.1)'};
  border: 1px solid
    ${(props) =>
      props.$ok ? 'rgba(0, 255, 122, 0.24)' : 'rgba(251, 191, 36, 0.24)'};
`;

export default function ClaimPage() {
  const { isConnected, address, isConnecting, connect } = useMockWallet();
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimTxHash, setClaimTxHash] = useState<string | null>(null);

  const eligibility = useMemo(() => {
    if (!address) {
      return { tier: '—', creditAllocation: 0, status: 'wallet not connected' };
    }
    const record = getMockEligibility(address);
    return {
      tier: record.tier ?? 'SEED',
      creditAllocation: record.entitlementCredits,
      status: String(record.status),
    };
  }, [address]);

  return (
    <Layout>
      <PageContainer>
        <PageTitle>Claim Cognition Credits</PageTitle>
        <PageDescription>
          Claim your allocated cognition credits based on your LAND ownership
          tier and activity.
        </PageDescription>
        <DemoNotice>
          <strong>Demo build.</strong> Tier and credit numbers here come from
          local mock rules, not from live LAND ownership or the credit contract.
          A claim can only settle once the claim API and the contract are live.
        </DemoNotice>
        {!isConnected && (
          <MockData>
            <MockLabel>Wallet</MockLabel>
            <p>Connect the demo wallet to walk through the claim flow.</p>
            <ConnectButton onClick={connect} disabled={isConnecting}>
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </ConnectButton>
          </MockData>
        )}
        {isConnected && address && (
          <MockData>
            <MockLabel>Connected Wallet</MockLabel>
            <ConnectedAddress>{address}</ConnectedAddress>
          </MockData>
        )}
        <ClaimPanel
          address={address}
          eligibility={eligibility}
          onClaimSuccess={(txHash) => {
            setClaimError(null);
            setClaimTxHash(txHash);
          }}
          onClaimError={(error) => {
            setClaimTxHash(null);
            setClaimError(error);
          }}
        />
        {claimTxHash && (
          <StatusBox $ok>
            Claim returned a transaction hash: <code>{claimTxHash}</code>
          </StatusBox>
        )}
        {claimError && !claimTxHash && <StatusBox $ok={false}>{claimError}</StatusBox>}
      </PageContainer>
    </Layout>
  );
}
