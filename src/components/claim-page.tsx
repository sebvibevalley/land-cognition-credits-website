'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from '@/components/layout';
import { useMockWallet } from '@/lib/mock/mock-wallet';
import ClaimPanel from '@/components/claim-panel-component-v2';

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

export default function ClaimPage() {
  const { isConnected, address, isConnecting, connect } = useMockWallet();
  const [eligibility] = useState({
    tier: 'SEED',
    creditAllocation: 500,
    status: 'eligible',
  });

  return (
    <Layout>
      <PageContainer>
        <PageTitle>Claim Cognition Credits</PageTitle>
        <PageDescription>
          Claim your allocated cognition credits based on your LAND ownership
          tier and activity.
        </PageDescription>
        {!isConnected && (
          <MockData>
            <MockLabel>Mock Mode</MockLabel>
            <p>Connect the mock wallet to simulate a claim.</p>
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
            console.log('Claim successful:', txHash);
          }}
          onClaimError={(error) => {
            console.error('Claim failed:', error);
          }}
        />
      </PageContainer>
    </Layout>
  );
}
