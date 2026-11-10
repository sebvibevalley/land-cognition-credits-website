import { http, createConfig } from 'wagmi';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';
import { baseSepolia } from 'wagmi/chains';

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const connectors = [
  injected({
    shimDisconnect: true,
  }),
  coinbaseWallet({
    appName: 'LAND Cognition Credit Distribution',
  }),
  ...(walletConnectProjectId
    ? [
        walletConnect({
          projectId: walletConnectProjectId,
          metadata: {
            name: 'LAND Cognition Credit Distribution',
            description: 'Wallet onboarding for LAND Cognition Credit Distribution on Base Sepolia.',
            url: 'http://localhost:3000',
            icons: ['https://placehold.co/256x256/png'],
          },
          showQrModal: true,
        }),
      ]
    : []),
];

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors,
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
  },
});

export { baseSepolia };
