'use client'

import { useEffect } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { fetchSolana, fetchEthereum, fetchSolanaTransactions, fetchEthereumTransactions } from '@/lib/api-client';
import WalletConnectSolana from '@/components/wallet/wallet-connect-solana';
import WalletConnectEthereum from '@/components/wallet/wallet-connect-ethereum';
import ChainSummaryCard from '@/components/portfolio/chain-summary-card';
import TotalValueCard from '@/components/portfolio/total-value-card';
import TokenTable from '@/components/portfolio/token-table';
import PortfolioChart from '@/components/portfolio/portfolio-chart';
import PortfolioStats from '@/components/portfolio/portfolio-stats';
import TransactionHistory from '@/components/portfolio/transaction-history';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAccount } from 'wagmi';

export default function PortfolioPage() {
  const {
    solAddress,
    ethAddress,
    solanaData,
    ethereumData,
    setSolAddress,
    setEthAddress,
    setSolanaData,
    setEthereumData,
    setSolanaTransactions,
    setEthereumTransactions,
    setLoading,
    setError,
    loading,
    error,
  } = usePortfolioStore();

  const { publicKey } = useWallet();
  const { address: ethAddr } = useAccount();

  // Update addresses when wallets connect/disconnect
  useEffect(() => {
    if (publicKey) {
      setSolAddress(publicKey.toString());
    } else {
      setSolAddress(null);
      setSolanaData(null);
    }
  }, [publicKey, setSolAddress, setSolanaData]);

  useEffect(() => {
    if (ethAddr) {
      setEthAddress(ethAddr);
    } else {
      setEthAddress(null);
      setEthereumData(null);
    }
  }, [ethAddr, setEthAddress, setEthereumData]);

  // Fetch data when addresses change
  useEffect(() => {
    const fetchData = async () => {
      if (solAddress) {
        setLoading(true);
        setError(null);
        try {
          const [data, transactions] = await Promise.all([
            fetchSolana(solAddress),
            fetchSolanaTransactions(solAddress, 10).catch(() => []),
          ]);
          setSolanaData(data);
          setSolanaTransactions(transactions);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to fetch Solana data');
          setSolanaData(null);
          setSolanaTransactions([]);
        } finally {
          setLoading(false);
        }
      }

      if (ethAddress) {
        setLoading(true);
        setError(null);
        try {
          const [data, transactions] = await Promise.all([
            fetchEthereum(ethAddress),
            fetchEthereumTransactions(ethAddress, 10).catch(() => []),
          ]);
          setEthereumData(data);
          setEthereumTransactions(transactions);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to fetch Ethereum data');
          setEthereumData(null);
          setEthereumTransactions([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [solAddress, ethAddress, setSolanaData, setEthereumData, setSolanaTransactions, setEthereumTransactions, setLoading, setError]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Portfolio</h1>
        </div>
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <WalletConnectSolana />
          <WalletConnectEthereum />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="text-red-800 dark:text-red-200">{error}</div>
        </div>
      )}

      {/* Total value card */}
      <div className="mb-6">
        <TotalValueCard />
      </div>

      {/* Chain summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChainSummaryCard 
          data={solanaData} 
          chainName="Solana" 
          nativeSymbol="SOL"
          loading={loading && solAddress !== null}
        />
        <ChainSummaryCard 
          data={ethereumData} 
          chainName="Ethereum" 
          nativeSymbol="ETH"
          loading={loading && ethAddress !== null}
        />
      </div>

      {/* Charts and stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PortfolioChart />
        <PortfolioStats />
      </div>

      {/* Token table */}
      <div className="mb-6">
        <TokenTable />
      </div>

      {/* Transaction history */}
      <div className="mb-6">
        <TransactionHistory />
      </div>
    </div>
  );
}

