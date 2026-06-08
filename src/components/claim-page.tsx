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

export default function ClaimPage() {
  const { isConnected, address } = useMockWallet();
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
            <p>Connect wallet or use mock data for demonstration.</p>
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