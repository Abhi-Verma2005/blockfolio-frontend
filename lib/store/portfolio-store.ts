import { create } from 'zustand';

export interface PortfolioData {
  chain: string;
  address: string;
  nativeBalance: number;
  nativePriceUsd: number;
  nativeValueUsd: number;
  tokens: Token[];
  totalTokensCount?: number;
  lastUpdated?: string;
}

export interface Token {
  symbol: string;
  mintOrAddress: string;
  amount: number;
  decimals: number;
  priceUsd: number;
  valueUsd: number;
  name?: string;
  logoUri?: string;
  priceChange24h?: number;
}

export interface Transaction {
  hash: string;
  timestamp: number;
  type: string;
  amount: number;
  tokenSymbol: string;
  chain: string;
  status: string;
  from: string;
  to: string;
}

interface PortfolioStore {
  solAddress: string | null;
  ethAddress: string | null;
  solanaData: PortfolioData | null;
  ethereumData: PortfolioData | null;
  solanaTransactions: Transaction[];
  ethereumTransactions: Transaction[];
  loading: boolean;
  error: string | null;
  
  setSolAddress: (address: string | null) => void;
  setEthAddress: (address: string | null) => void;
  setSolanaData: (data: PortfolioData | null) => void;
  setEthereumData: (data: PortfolioData | null) => void;
  setSolanaTransactions: (transactions: Transaction[]) => void;
  setEthereumTransactions: (transactions: Transaction[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  solAddress: null,
  ethAddress: null,
  solanaData: null,
  ethereumData: null,
  solanaTransactions: [],
  ethereumTransactions: [],
  loading: false,
  error: null,
  
  setSolAddress: (address) => set({ solAddress: address }),
  setEthAddress: (address) => set({ ethAddress: address }),
  setSolanaData: (data) => set({ solanaData: data }),
  setEthereumData: (data) => set({ ethereumData: data }),
  setSolanaTransactions: (transactions) => set({ solanaTransactions: transactions }),
  setEthereumTransactions: (transactions) => set({ ethereumTransactions: transactions }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearData: () => set({
    solAddress: null,
    ethAddress: null,
    solanaData: null,
    ethereumData: null,
    solanaTransactions: [],
    ethereumTransactions: [],
    loading: false,
    error: null,
  }),
}));

