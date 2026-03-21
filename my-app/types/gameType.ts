// =========================
// CORE TYPES
// =========================

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Game {
  id: string;
  user_id: string;

  start_year: number;
  current_year: number;

  starting_money: number;
  current_money: number;
  income: number;

  created_at: string;
}

export interface Year {
  id: string;
  game_id: string;
  year_number: number;
  global_summary: string | null;
  created_at: string;
}

// =========================
// MARKET STRUCTURE
// =========================

export interface Sector {
  id: string;
  name: string;
}

export interface Stock {
  id: string;
  name: string;
  ticker: string;
  sector_id: string;
  base_price: number;
}

// =========================
// NEWS (AI GENERATED)
// =========================

export interface NewsEvent {
  id: string;
  year_id: string;

  title: string | null;
  description: string | null;

  event_type: string | null;

  probability: number;

  sector_impacts_if_true: Record<string, number> | null;
  sector_impacts_if_false: Record<string, number> | null;

  resolved: boolean;
  actual_outcome: Record<string, number> | null;

  created_at: string;
}

// =========================
// STOCK DATA
// =========================

export interface YearSummary {
  id: string;
  stock_id: string;
  year_id: string;

  open_price: number | null;
  close_price: number | null;
  high_price: number | null;
  low_price: number | null;
}

export interface YearlyPrice {
  id: string;
  stock_id: string;
  year_id: string;

  month: number; // 1–12
  price: number;
}

// =========================
// PORTFOLIO
// =========================

export interface Portfolio {
  id: string;
  game_id: string;
  stock_id: string;

  shares: number;
  avg_buy_price: number;

  // joined stock data
  stocks?: Stock;
}

// =========================
// TRANSACTIONS
// =========================

export type TransactionType = 'buy' | 'sell';

export interface Transaction {
  id: string;
  game_id: string;
  stock_id: string;

  type: TransactionType;

  shares: number;
  price: number;

  year_id: string;
  created_at: string;
}

// =========================
// NET WORTH
// =========================

export interface NetWorthHistory {
  id: string;
  game_id: string;
  year_id: string;
  net_worth: number;
}

// =========================
// HELPER TYPES (VERY USEFUL)
// =========================

// Used for API responses
export interface GameWithPortfolio extends Game {
  portfolio: Portfolio[];
}

export interface StockWithPrices extends Stock {
  prices: YearlyPrice[];
}

// Used for simulation
export interface SectorImpact {
  [sectorName: string]: number; // e.g. { "tech": -5 }
}

export interface SimulatedStockUpdate {
  stock_id: string;
  new_price: number;
  monthly_prices: number[]; // length 12
}