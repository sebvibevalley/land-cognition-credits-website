'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from '@/components/layout';
import { useMockWallet } from '@/lib/mock/mock-wallet';
import EligibilityPanel from '@/components/eligibility-panel-component';

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

const AddressInput = styled.input`
  width: 100%;
  max-width: 500px;
  min-height: 48px;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  color: #f5f7fa;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  &::placeholder {
    color: #6f7c8a;
  }
  &:focus-visible {
    outline: 2px solid #7dd3fc;
    outline-offset: 2px;
  }
`;

const AddressHint = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 2rem;
`;

export default function EligibilityPage() {
  const { isConnected, address: connectedAddress } = useMockWallet();
  const [manualAddress, setManualAddress] = useState('');
  const displayAddress = isConnected ? connectedAddress : manualAddress;

  return (
    <Layout>
      <PageContainer>
        <PageTitle>Check Eligibility</PageTitle>
        <PageDescription>
          Enter your wallet address to see how much LAND it holds on Polygon. LAND
          ownership is what makes you eligible for cognition credits.
        </PageDescription>
        {!isConnected && (
          <AddressInput
            type="text"
            placeholder="0x..."
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            aria-label="Wallet address"
          />
        )}
        <AddressHint>
          This reads the LAND balance straight from Polygon mainnet. Paste any
          address, no wallet connection needed.
        </AddressHint>
        {displayAddress && (
          <EligibilityPanel address={displayAddress} />
        )}
      </PageContainer>
    </Layout>
  );
}
