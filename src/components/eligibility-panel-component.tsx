'use client';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { getMockEligibility } from '@/lib/mock/mock-data';

const Panel = styled.div`
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
`;

const DemoNotice = styled.p`
  margin: 0 0 1.5rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.24);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const StatusText = styled.p`
  color: #94a3b8;
  font-size: 1rem;
  margin: 0;
  word-break: break-all;
`;

const Badge = styled.span<{ $eligible: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
  color: ${(props) => (props.$eligible ? '#00FF7A' : '#f87171')};
  background: ${(props) =>
    props.$eligible ? 'rgba(0, 255, 122, 0.12)' : 'rgba(248, 113, 113, 0.12)'};
  border: 1px solid
    ${(props) =>
      props.$eligible ? 'rgba(0, 255, 122, 0.24)' : 'rgba(248, 113, 113, 0.24)'};
`;

const Row = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const Label = styled.span`
  color: #64748b;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Value = styled.strong`
  color: #f8fafc;
  font-size: 1rem;
  font-weight: 600;
`;

type EligibilityPanelProps = {
  address: string;
};

export default function EligibilityPanel({ address }: EligibilityPanelProps) {
  const eligibility = useMemo(() => getMockEligibility(address), [address]);

  return (
    <Panel>
      <DemoNotice>
        Demo data, not live eligibility. These numbers come from local mock rules
        and are not derived from your LAND ownership or the credit contract.
      </DemoNotice>
      <Header>
        <StatusText>Eligibility for {address}</StatusText>
        <Badge $eligible={eligibility.eligible}>
          {eligibility.eligible ? 'Eligible' : 'Not eligible'}
        </Badge>
      </Header>
      <Row>
        <Label>Tier</Label>
        <Value>{eligibility.tier ?? 'SEED'}</Value>
      </Row>
      <Row>
        <Label>Credits</Label>
        <Value>{eligibility.entitlementCredits.toString()}</Value>
      </Row>
      <Row>
        <Label>Activity multiplier</Label>
        <Value>{(eligibility.activityMultiplier ?? 1).toFixed(2)}</Value>
      </Row>
      <Row>
        <Label>Status</Label>
        <Value>{eligibility.status}</Value>
      </Row>
    </Panel>
  );
}
