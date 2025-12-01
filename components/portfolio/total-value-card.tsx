'use client'

import { usePortfolioStore } from '@/lib/store/portfolio-store';

export default function TotalValueCard() {
  const { solanaData, ethereumData, loading } = usePortfolioStore();

  const calculateTotal = () => {
    let total = 0;
    if (solanaData) {
      total += solanaData.nativeValueUsd;
      total += solanaData.tokens.reduce((sum, token) => sum + token.valueUsd, 0);
    }
    if (ethereumData) {
      total += ethereumData.nativeValueUsd;
      total += ethereumData.tokens.reduce((sum, token) => sum + token.valueUsd, 0);
    }
    return total;
  };

  const total = calculateTotal();

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Portfolio Value</div>
      <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        {loading ? 'Loading...' : `$${total.toFixed(2)}`}
      </div>
    </div>
  );
}

