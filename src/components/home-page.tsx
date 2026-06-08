'use client';

import React from 'react';
import styled from 'styled-components';
import Layout from '@/components/layout';
import { useMockWallet } from '@/lib/mock/mock-wallet';

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 0;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 1rem;
  background: linear-gradient(135deg, #7dd3fc 0%, #22c55e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #22c55e 0%, #7dd3fc 100%);
  color: #071018;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, opacity 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  border: 1px solid rgba(125, 211, 252, 0.24);
  background: rgba(125, 211, 252, 0.12);
  color: #f8fafc;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: transform 0.2s ease, background 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    background: rgba(125, 211, 252, 0.18);
  }
`;

const FeaturesSection = styled.section`
  padding: 2rem 0;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const FeatureCard = styled.div`
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
  color: #f8fafc;
`;

const FeatureDescription = styled.p`
  font-size: 0.95rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.6;
`;

export default function HomePage() {
  const { isConnected, address } = useMockWallet();

  return (
    <Layout>
      <HeroSection>
        <Title>LAND Cognition Credits</Title>
        <Subtitle>
          Claim your allocated cognition credits based on LAND ownership.
          Secure, transparent, and engineering-focused credit claim workflows.
        </Subtitle>
        <ButtonGroup>
          <PrimaryButton href="/eligibility">Check Eligibility</PrimaryButton>
          <SecondaryButton href="/about">Learn More</SecondaryButton>
        </ButtonGroup>
      </HeroSection>
      <FeaturesSection>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureTitle>Transparent Allocation</FeatureTitle>
            <FeatureDescription>
              Credits are allocated based on LAND ownership tier and activity,
              with deterministic formulas and verifiable on-chain proofs.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureTitle>Secure Claim Process</FeatureTitle>
            <FeatureDescription>
              Claim credits with wallet signature verification and idempotent
              transaction handling. No double-claims possible.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureTitle>Engineering-First Design</FeatureTitle>
            <FeatureDescription>
              Built with minimal surfaces, clear entitlement boundaries, and
              reproducible links between LAND metadata and cognition services.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </Layout>
  );
}