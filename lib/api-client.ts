import { PortfolioData, Transaction } from './store/portfolio-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchSolana(address: string): Promise<PortfolioData> {
  const response = await fetch(`${API_URL}/solana/balances/${address}`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch Solana data' }));
    throw new Error(error.error || 'Failed to fetch Solana data');
  }
  
  return response.json();
}

export async function fetchEthereum(address: string): Promise<PortfolioData> {
  const response = await fetch(`${API_URL}/ethereum/balances/${address}`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch Ethereum data' }));
    throw new Error(error.error || 'Failed to fetch Ethereum data');
  }
  
  return response.json();
}

export async function fetchSolanaTransactions(address: string, limit: number = 10): Promise<Transaction[]> {
  const response = await fetch(`${API_URL}/solana/transactions/${address}?limit=${limit}`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch Solana transactions' }));
    throw new Error(error.error || 'Failed to fetch Solana transactions');
  }
  
  return response.json();
}

export async function fetchEthereumTransactions(address: string, limit: number = 10): Promise<Transaction[]> {
  const response = await fetch(`${API_URL}/ethereum/transactions/${address}?limit=${limit}`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch Ethereum transactions' }));
    throw new Error(error.error || 'Failed to fetch Ethereum transactions');
  }
  
  return response.json();
}

