'use client'

import { usePortfolioStore } from '@/lib/store/portfolio-store';

export default function TransactionHistory() {
  const { solanaTransactions, ethereumTransactions } = usePortfolioStore();

  const allTransactions = [
    ...solanaTransactions.map(tx => ({ ...tx, chain: 'Solana' })),
    ...ethereumTransactions.map(tx => ({ ...tx, chain: 'Ethereum' })),
  ].sort((a, b) => b.timestamp - a.timestamp);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const getExplorerUrl = (hash: string, chain: string) => {
    if (chain === 'Solana') {
      return `https://solscan.io/tx/${hash}`;
    } else {
      return `https://etherscan.io/tx/${hash}`;
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === 'send' || type === 'transfer') {
      return '↗';
    } else {
      return '↙';
    }
  };

  if (allTransactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Transaction History</h2>
        <div className="text-center text-gray-500 dark:text-gray-400">No transactions found</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Transaction History</h2>
      </header>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20">
            <tr>
              <th className="px-5 py-3 whitespace-nowrap">
                <div className="text-left font-semibold">Date</div>
              </th>
              <th className="px-5 py-3 whitespace-nowrap">
                <div className="text-left font-semibold">Type</div>
              </th>
              <th className="px-5 py-3 whitespace-nowrap">
                <div className="text-left font-semibold">Token</div>
              </th>
              <th className="px-5 py-3 whitespace-nowrap">
                <div className="text-left font-semibold">Amount</div>
              </th>
              <th className="px-5 py-3 whitespace-nowrap">
                <div className="text-left font-semibold">Status</div>
              </th>
              <th className="px-5 py-3 whitespace-nowrap">
                <div className="text-left font-semibold">Hash</div>
              </th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
            {allTransactions.map((tx, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="text-gray-800 dark:text-gray-100">{formatDate(tx.timestamp)}</div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTypeIcon(tx.type)}</span>
                    <span className="text-gray-800 dark:text-gray-100 capitalize">{tx.type}</span>
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="text-gray-800 dark:text-gray-100">{tx.tokenSymbol}</div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="text-gray-800 dark:text-gray-100">{tx.amount.toFixed(4)}</div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    tx.status === 'success' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {tx.status}
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <a
                    href={getExplorerUrl(tx.hash, tx.chain)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}






