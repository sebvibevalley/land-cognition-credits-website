'use client';

import React from 'react';
import styled from 'styled-components';
import Layout from '@/components/layout';

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

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: #f8fafc;
`;

const Paragraph = styled.p`
  font-size: 1.05rem;
  color: #94a3b8;
  margin: 0 0 1rem;
  line-height: 1.7;
`;

const List = styled.ul`
  color: #94a3b8;
  padding-left: 1.5rem;
  margin: 0 0 1rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
  line-height: 1.6;
`;

const Highlight = styled.span`
  color: #7dd3fc;
  font-weight: 500;
`;

export default function AboutPage() {
  return (
    <Layout>
      <PageContainer>
        <PageTitle>About LAND Cognition Credits</PageTitle>
        <Section>
          <SectionTitle>What are Cognition Credits?</SectionTitle>
          <Paragraph>
            Cognition Credits are digital tokens allocated to LAND owners in the
            Sandbox ecosystem. They represent a share of the cognition resources
            available for AI-powered experiences within LAND parcels.
          </Paragraph>
          <Paragraph>
            Credits are allocated based on a deterministic formula that considers
            your LAND ownership tier, activity level, and the emission curve schedule.
          </Paragraph>
        </Section>
        <Section>
          <SectionTitle>Allocation Formula</SectionTitle>
          <Paragraph>
            Credits are calculated using the following formula:
          </Paragraph>
          <Paragraph>
            <Highlight>credits = baseAllocation × activityMultiplier × tierWeight × decayFactor^iterations</Highlight>
          </Paragraph>
          <List>
            <ListItem><Highlight>baseAllocation:</Highlight> Starting allocation based on tier</ListItem>
            <ListItem><Highlight>activityMultiplier:</Highlight> Based on recent transaction activity</ListItem>
            <ListItem><Highlight>tierWeight:</Highlight> Weight for your LAND ownership tier (SEED, CREATOR, ESTATE, WHALE)</ListItem>
            <ListItem><Highlight>decayFactor:</Highlight> Emission curve decay over time</ListItem>
          </List>
        </Section>
        <Section>
          <SectionTitle>Claim Process</SectionTitle>
          <Paragraph>
            The claim process is designed to be secure, transparent, and idempotent:
          </Paragraph>
          <List>
            <ListItem>Connect your wallet to verify LAND ownership</ListItem>
            <ListItem>Review your eligibility and credit allocation</ListItem>
            <ListItem>Sign a message to authorize the claim</ListItem>
            <ListItem>Receive credits directly to your wallet</ListItem>
          </List>
        </Section>
        <Section>
          <SectionTitle>Technical Architecture</SectionTitle>
          <Paragraph>
            The system is built with minimal surfaces and clear entitlement boundaries.
            All allocations are verifiable through on-chain proofs and deterministic formulas.
            No central authority can modify your allocation.
          </Paragraph>
        </Section>
      </PageContainer>
    </Layout>
  );
}