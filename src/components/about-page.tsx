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

const Notice = styled.p`
  font-size: 1rem;
  color: #f8fafc;
  margin: 0 0 1rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border: 1px solid rgba(125, 211, 252, 0.24);
  background: rgba(125, 211, 252, 0.1);
  line-height: 1.6;
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
          <Notice>
            Status: eligibility only. Checking your LAND balance works today and
            reads the Polygon contract directly. The credit amount and the claim
            route depend on a distributor contract that has not been deployed, so
            no credit number shown here is final and no claim sends a transaction.
          </Notice>
        </Section>
        <Section>
          <SectionTitle>What are Cognition Credits?</SectionTitle>
          <Paragraph>
            Cognition Credits are meant to be tokens granted to LAND owners in the
            Sandbox ecosystem, representing a share of the cognition resources
            available for AI-powered experiences within LAND parcels.
          </Paragraph>
          <Paragraph>
            The intent is to allocate them on a deterministic formula built from
            LAND ownership tier, activity level, and an emission curve schedule.
            That formula is a design, not yet a deployed contract.
          </Paragraph>
        </Section>
        <Section>
          <SectionTitle>Proposed allocation formula</SectionTitle>
          <Paragraph>
            The current working design is:
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
          <Paragraph>
            None of these terms are readable on-chain today. They will live in the
            distributor contract, and until it ships the eligibility page labels any
            illustrative numbers as demo data.
          </Paragraph>
        </Section>
        <Section>
          <SectionTitle>How claiming will work</SectionTitle>
          <Paragraph>
            Once the distributor is deployed, the flow is intended to be:
          </Paragraph>
          <List>
            <ListItem>Connect your wallet to prove LAND ownership</ListItem>
            <ListItem>Review your eligibility and credit allocation</ListItem>
            <ListItem>Sign a message to authorize the claim</ListItem>
            <ListItem>Receive credits directly to your wallet</ListItem>
          </List>
          <Paragraph>
            Right now none of that is live. The claim page is a labelled walkthrough
            and sends nothing.
          </Paragraph>
        </Section>
        <Section>
          <SectionTitle>Technical architecture</SectionTitle>
          <Paragraph>
            The build is deliberately small: eligibility reads LAND balanceOf on
            Polygon through a public RPC, and the site stays a static export. The
            entitlement boundaries and the link between LAND metadata and cognition
            services will live in the distributor contract once it exists.
          </Paragraph>
        </Section>
      </PageContainer>
    </Layout>
  );
}
