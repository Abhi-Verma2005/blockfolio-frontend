'use client'

import { PortfolioData } from '@/lib/store/portfolio-store';

interface ChainSummaryCardProps {
  data: PortfolioData | null;
  chainName: string;
  nativeSymbol: string;
  loading?: boolean;
}

export default function ChainSummaryCard({ data, chainName, nativeSymbol, loading }: ChainSummaryCardProps) {
  if (loading) {
    return (
      <div className="flex flex-col bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{chainName}</div>
        <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{chainName}</div>
        <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">Not connected</div>
      </div>
    );
  }

  const nativeBalance = Number(data.nativeBalance ?? 0);
  const nativeValueUsd = Number(data.nativeValueUsd ?? 0);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{chainName}</div>
      <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
        {nativeBalance.toFixed(4)} {nativeSymbol}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        ${nativeValueUsd.toFixed(2)} USD
      </div>
    </div>
  );
}

