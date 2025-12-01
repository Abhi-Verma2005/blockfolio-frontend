'use client'

import { useState, useMemo } from 'react';
import { usePortfolioStore, Token } from '@/lib/store/portfolio-store';

type SortField = 'value' | 'price' | 'change' | 'allocation' | 'chain';
type SortDirection = 'asc' | 'desc';

export default function TokenTable() {
  const { solanaData, ethereumData } = usePortfolioStore();
  const [sortField, setSortField] = useState<SortField>('value');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterChain, setFilterChain] = useState<string>('all');

  // Calculate total portfolio value for allocation calculation
  const totalValue = useMemo(() => {
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
  }, [solanaData, ethereumData]);

  const allTokens: (Token & { chain: string; allocation: number })[] = [];

  // Add native SOL token
  if (solanaData && solanaData.nativeBalance > 0) {
    allTokens.push({
      symbol: 'SOL',
      mintOrAddress: 'So11111111111111111111111111111111111111112',
      amount: solanaData.nativeBalance,
      decimals: 9,
      priceUsd: solanaData.nativePriceUsd,
      valueUsd: solanaData.nativeValueUsd,
      name: 'Solana',
      chain: 'Solana',
      allocation: totalValue > 0 ? (solanaData.nativeValueUsd / totalValue) * 100 : 0,
      priceChange24h: undefined,
    });
  }

  // Add native ETH token
  if (ethereumData && ethereumData.nativeBalance > 0) {
    allTokens.push({
      symbol: 'ETH',
      mintOrAddress: '0x0000000000000000000000000000000000000000',
      amount: ethereumData.nativeBalance,
      decimals: 18,
      priceUsd: ethereumData.nativePriceUsd,
      valueUsd: ethereumData.nativeValueUsd,
      name: 'Ethereum',
      chain: 'Ethereum',
      allocation: totalValue > 0 ? (ethereumData.nativeValueUsd / totalValue) * 100 : 0,
      priceChange24h: undefined,
    });
  }

  // Add SPL tokens
  if (solanaData) {
    solanaData.tokens.forEach(token => {
      allTokens.push({
        ...token,
        chain: 'Solana',
        allocation: totalValue > 0 ? (token.valueUsd / totalValue) * 100 : 0,
      });
    });
  }

  // Add ERC-20 tokens
  if (ethereumData) {
    ethereumData.tokens.forEach(token => {
      allTokens.push({
        ...token,
        chain: 'Ethereum',
        allocation: totalValue > 0 ? (token.valueUsd / totalValue) * 100 : 0,
      });
    });
  }

  // Filter by chain
  const filteredTokens = useMemo(() => {
    if (filterChain === 'all') return allTokens;
    return allTokens.filter(token => token.chain === filterChain);
  }, [allTokens, filterChain]);

  // Sort tokens
  const sortedTokens = useMemo(() => {
    return [...filteredTokens].sort((a, b) => {
      let aVal: number, bVal: number;
      
      switch (sortField) {
        case 'value':
          aVal = a.valueUsd;
          bVal = b.valueUsd;
          break;
        case 'price':
          aVal = a.priceUsd;
          bVal = b.priceUsd;
          break;
        case 'change':
          aVal = a.priceChange24h ?? 0;
          bVal = b.priceChange24h ?? 0;
          break;
        case 'allocation':
          aVal = a.allocation;
          bVal = b.allocation;
          break;
        case 'chain':
          aVal = a.chain.localeCompare(b.chain);
          bVal = 0;
          break;
        default:
          return 0;
      }
      
      if (sortField === 'chain') {
        return sortDirection === 'asc' ? aVal : -aVal;
      }
      
      const diff = aVal - bVal;
      return sortDirection === 'asc' ? diff : -diff;
    });
  }, [filteredTokens, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (sortedTokens.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
        <div className="text-center text-gray-500 dark:text-gray-400">No tokens found</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Tokens</h2>
        <div className="flex gap-2">
          <select
            value={filterChain}
            onChange={(e) => setFilterChain(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            <option value="all">All Chains</option>
            <option value="Solana">Solana</option>
            <option value="Ethereum">Ethereum</option>
          </select>
        </div>
      </header>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20">
            <tr>
              <th className="px-5 py-3 whitespace-nowrap">
                <div className="text-left font-semibold">Token</div>
              </th>
              <th className="px-5 py-3 whitespace-nowrap">
                <div className="text-left font-semibold">Name</div>
              </th>
              <th className="px-5 py-3 whitespace-nowrap">
                <div className="text-left font-semibold">Address</div>
              </th>
              <th className="px-5 py-3 whitespace-nowrap cursor-pointer" onClick={() => handleSort('amount')}>
                <div className="text-left font-semibold">Amount</div>
              </th>
              <th className="px-5 py-3 whitespace-nowrap cursor-pointer" onClick={() => handleSort('price')}>
                <div className="text-left font-semibold">Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}</div>
              </th>
              <th className="px-5 py-3 whitespace-nowrap cursor-pointer" onClick={() => handleSort('change')}>
                <div className="text-left font-semibold">24h Change {sortField === 'change' && (sortDirection === 'asc' ? '↑' : '↓')}</div>
              </th>
              <th className="px-5 py-3 whitespace-nowrap cursor-pointer" onClick={() => handleSort('value')}>
                <div className="text-left font-semibold">Value {sortField === 'value' && (sortDirection === 'asc' ? '↑' : '↓')}</div>
              </th>
              <th className="px-5 py-3 whitespace-nowrap cursor-pointer" onClick={() => handleSort('allocation')}>
                <div className="text-left font-semibold">Allocation {sortField === 'allocation' && (sortDirection === 'asc' ? '↑' : '↓')}</div>
              </th>
              <th className="px-5 py-3 whitespace-nowrap cursor-pointer" onClick={() => handleSort('chain')}>
                <div className="text-left font-semibold">Chain {sortField === 'chain' && (sortDirection === 'asc' ? '↑' : '↓')}</div>
              </th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
            {sortedTokens.map((token, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {token.logoUri ? (
                      <img src={token.logoUri} alt={token.symbol} className="w-6 h-6 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-medium">
                        {token.symbol.slice(0, 2)}
                      </div>
                    )}
                    <div className="font-medium text-gray-800 dark:text-gray-100">{token.symbol}</div>
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="text-gray-800 dark:text-gray-100">{token.name || '-'}</div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div 
                    className="text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-500"
                    onClick={() => copyToClipboard(token.mintOrAddress)}
                    title={token.mintOrAddress}
                  >
                    {truncateAddress(token.mintOrAddress)}
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="text-gray-800 dark:text-gray-100">{token.amount.toFixed(4)}</div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="text-gray-800 dark:text-gray-100">${token.priceUsd.toFixed(2)}</div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  {token.priceChange24h !== undefined ? (
                    <div className={token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                    </div>
                  ) : (
                    <div className="text-gray-400">-</div>
                  )}
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="font-medium text-green-500">${token.valueUsd.toFixed(2)}</div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="text-gray-600 dark:text-gray-400">{token.allocation.toFixed(2)}%</div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="text-gray-600 dark:text-gray-400">{token.chain}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

