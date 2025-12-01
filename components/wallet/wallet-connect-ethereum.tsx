'use client'

import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePortfolioStore } from '@/lib/store/portfolio-store';

export default function WalletConnectEthereum() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { setEthAddress } = usePortfolioStore();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          onClick={() => {
            disconnect();
            setEthAddress(null);
          }}
          className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return <ConnectButton />;
}

