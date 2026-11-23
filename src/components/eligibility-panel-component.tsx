'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  CREDITS_NOT_LIVE_NOTE,
  LAND_CHAIN_NAME,
  LAND_CONTRACT_ADDRESS,
  LAND_CONTRACT_EXPLORER_URL,
  getLandBalance,
  isValidAddress,
  type LandReadResult,
} from '@/lib/land';

const Panel = styled.div`
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
`;

const Notice = styled.p`
  margin: 0 0 1.5rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #7dd3fc;
  background: rgba(125, 211, 252, 0.08);
  border: 1px solid rgba(125, 211, 252, 0.2);
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
  text-align: right;
  word-break: break-all;
`;

const Footnote = styled.p`
  margin: 1.25rem 0 0;
  color: #94a3b8;
  font-size: 0.875rem;
  line-height: 1.6;
`;

const ErrorBox = styled.p`
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.24);
`;

const ExplorerLink = styled.a`
  color: #7dd3fc;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

type EligibilityPanelProps = {
  address: string;
};

export default function EligibilityPanel({ address }: EligibilityPanelProps) {
  const [result, setResult] = useState<LandReadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const trimmed = address.trim();

    if (!trimmed) {
      setResult(null);
      setError(null);
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    if (!isValidAddress(trimmed)) {
      setResult(null);
      setError('That is not a valid 0x address.');
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    setError(null);
    setResult(null);

    getLandBalance(trimmed)
      .then((next) => {
        if (!cancelled) setResult(next);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'The Polygon read failed.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [address]);

  const badgeLabel = loading
    ? 'Reading Polygon…'
    : result
      ? result.eligible
        ? 'Eligible'
        : 'No LAND found'
      : '—';

  return (
    <Panel>
      <Notice>
        Live LAND balance, read from the Polygon chain for this address. Eligible
        here means you hold at least one LAND. The credit number is not live yet,
        so none is shown.
      </Notice>
      <Header>
        <StatusText>LAND check for {address}</StatusText>
        <Badge $eligible={Boolean(result?.eligible)}>{badgeLabel}</Badge>
      </Header>
      {error && <ErrorBox>{error} Nothing was assumed.</ErrorBox>}
      {result && (
        <>
          <Row>
            <Label>LAND owned</Label>
            <Value>{result.landCount.toLocaleString()}</Value>
          </Row>
          <Row>
            <Label>Tier band</Label>
            <Value>{result.tier ?? 'none'}</Value>
          </Row>
          <Row>
            <Label>Network</Label>
            <Value>
              {LAND_CHAIN_NAME} ({result.chainId})
            </Value>
          </Row>
          <Row>
            <Label>Contract</Label>
            <Value>
              <ExplorerLink
                href={LAND_CONTRACT_EXPLORER_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {LAND_CONTRACT_ADDRESS}
              </ExplorerLink>
            </Value>
          </Row>
          <Row>
            <Label>Read at</Label>
            <Value>
              block {result.blockNumber !== null ? result.blockNumber.toLocaleString() : 'unknown'}
            </Value>
          </Row>
        </>
      )}
      <Footnote>
        Tier bands are a proposal: SEED 1+, CREATOR 10+, ESTATE 50+, WHALE 200+
        LAND. {CREDITS_NOT_LIVE_NOTE}
      </Footnote>
    </Panel>
  );
}
