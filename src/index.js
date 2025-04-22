import React from "react";
import ReactDOM from 'react-dom/client';
import Router from "./components/Router";

import '@mysten/dapp-kit/dist/index.css';

import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const networks = {
	testnet: { url: getFullnodeUrl('testnet') },
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider>
          <Router />
        </WalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
  </React.StrictMode>
);
