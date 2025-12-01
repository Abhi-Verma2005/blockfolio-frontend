'use client'

import { useMemo } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';

export default function PortfolioStats() {
  const { solanaData, ethereumData } = usePortfolioStore();

  const stats = useMemo(() => {
    const solanaTokens = solanaData?.tokens.length || 0;
    const ethereumTokens = ethereumData?.tokens.length || 0;
    const totalTokens = solanaTokens + ethereumTokens + 
      (solanaData && solanaData.nativeBalance > 0 ? 1 : 0) +
      (ethereumData && ethereumData.nativeBalance > 0 ? 1 : 0);

    const chainsConnected = [
      solanaData && (solanaData.nativeBalance > 0 || solanaData.tokens.length > 0),
      ethereumData && (ethereumData.nativeBalance > 0 || ethereumData.tokens.length > 0),
    ].filter(Boolean).length;

    // Calculate portfolio allocation by chain
    let totalValue = 0;
    let solanaValue = 0;
    let ethereumValue = 0;

    if (solanaData) {
      solanaValue += solanaData.nativeValueUsd;
      solanaValue += solanaData.tokens.reduce((sum, token) => sum + token.valueUsd, 0);
      totalValue += solanaValue;
    }

    if (ethereumData) {
      ethereumValue += ethereumData.nativeValueUsd;
      ethereumValue += ethereumData.tokens.reduce((sum, token) => sum + token.valueUsd, 0);
      totalValue += ethereumValue;
    }

    const solanaAllocation = totalValue > 0 ? (solanaValue / totalValue) * 100 : 0;
    const ethereumAllocation = totalValue > 0 ? (ethereumValue / totalValue) * 100 : 0;

    // Find best and worst performing tokens (24h)
    const allTokens = [
      ...(solanaData?.tokens || []),
      ...(ethereumData?.tokens || []),
    ];

    const tokensWithChange = allTokens.filter(t => t.priceChange24h !== undefined);
    const bestPerformer = tokensWithChange.length > 0
      ? tokensWithChange.reduce((best, token) => 
          (token.priceChange24h || 0) > (best.priceChange24h || 0) ? token : best
        )
      : null;
    const worstPerformer = tokensWithChange.length > 0
      ? tokensWithChange.reduce((worst, token) => 
          (token.priceChange24h || 0) < (worst.priceChange24h || 0) ? token : worst
        )
      : null;

    // Calculate average token price
    const tokensWithPrice = allTokens.filter(t => t.priceUsd > 0);
    const avgPrice = tokensWithPrice.length > 0
      ? tokensWithPrice.reduce((sum, token) => sum + token.priceUsd, 0) / tokensWithPrice.length
      : 0;

    return {
      totalTokens,
      solanaTokens,
      ethereumTokens,
      chainsConnected,
      solanaAllocation,
      ethereumAllocation,
      bestPerformer,
      worstPerformer,
      avgPrice,
    };
  }, [solanaData, ethereumData]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
      <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Portfolio Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Tokens</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.totalTokens}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Chains Connected</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.chainsConnected}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Solana Allocation</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.solanaAllocation.toFixed(1)}%</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Ethereum Allocation</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.ethereumAllocation.toFixed(1)}%</div>
        </div>
      </div>
      
      {stats.bestPerformer && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Best Performer (24h)</div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800 dark:text-gray-100">{stats.bestPerformer.symbol}</span>
            <span className="text-green-500 font-medium">
              +{stats.bestPerformer.priceChange24h?.toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      {stats.worstPerformer && (
        <div className="mt-2">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Worst Performer (24h)</div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800 dark:text-gray-100">{stats.worstPerformer.symbol}</span>
            <span className="text-red-500 font-medium">
              {stats.worstPerformer.priceChange24h?.toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      {stats.avgPrice > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">Average Token Price</div>
          <div className="text-xl font-bold text-gray-800 dark:text-gray-100">${stats.avgPrice.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}






