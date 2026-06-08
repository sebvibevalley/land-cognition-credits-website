'use client';

import React from 'react';
import styled from 'styled-components';

const Panel = styled.div`
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
`;

const StatusText = styled.p`
  color: #94a3b8;
  font-size: 1rem;
`;

type EligibilityPanelProps = {
  address: string;
};

export default function EligibilityPanel({ address }: EligibilityPanelProps) {
  return (
    <Panel>
      <StatusText>Loading eligibility for {address}...</StatusText>
    </Panel>
  );
}