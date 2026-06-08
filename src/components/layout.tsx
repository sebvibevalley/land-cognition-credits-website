'use client';

import React, { type ReactNode } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #071018;
  color: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const Logo = styled(Link)`
  font-size: 1.25rem;
  font-weight: 700;
  color: #f8fafc;
  text-decoration: none;
  background: linear-gradient(135deg, #7dd3fc 0%, #22c55e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.2s;
  &:hover {
    color: #f8fafc;
  }
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Footer = styled.footer`
  text-align: center;
  padding: 2rem;
  color: #475569;
  font-size: 0.875rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 4rem;
`;

type LayoutProps = Readonly<{ children: ReactNode }>;

export default function Layout({ children }: LayoutProps) {
  return (
    <PageWrapper>
      <Nav>
        <Logo href="/">LAND Credits</Logo>
        <NavLinks>
          <NavLink href="/eligibility">Eligibility</NavLink>
          <NavLink href="/claim">Claim</NavLink>
          <NavLink href="/about">About</NavLink>
        </NavLinks>
      </Nav>
      <Main>{children}</Main>
      <Footer>LAND Cognition Credits — Built with Ethoswarm</Footer>
    </PageWrapper>
  );
}