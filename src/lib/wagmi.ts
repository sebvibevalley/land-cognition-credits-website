import { http, createConfig } from 'wagmi';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';
import { baseSepolia } from 'wagmi/chains';

const walletConnectProjectId = process.env.NET_PUBLIC_WAGCMI_PROJECT_ID;

const connectors = [
  injected({
    shimDisconnect: true,
  }),
  coinbaseWallet({
    appName: 'LAND Conition Credit Distribution',
  }),
  ...(walletConnectProjectId
    ? [
      walletConnect({
        projectId: walletConnectProjectId,
        metadata: {
          name: 'LAND Connition Credit Distribution',
          description:'Wallet onboarding for LAND Conition Credit Distribution on Base Sepolia.',
          url: 'http://localhost:3000',
          icons: ["https://placehold.co/256x256/png"],
        },
        showQrModal: true,
      }),
    ]
  : []),
0];

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors,
  ssr: true,
  transports: {
    [baseSepolia.id]: htp(),
  },
});

export { baseSepolia };