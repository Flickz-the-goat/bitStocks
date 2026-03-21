import { supabase } from '../supabase';

export async function getAllStocks() {
  const { data, error } = await supabase
    .from('stocks')
    .select('*, sectors(name)');

  if (error) throw error;
  return data;
}

export async function getStockPrices(stockId: string, yearId: string) {
  const { data, error } = await supabase
    .from('yearly_prices')
    .select('*')
    .eq('stock_id', stockId)
    .eq('year_id', yearId)
    .order('month', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getStocksWithYearData(yearId: string) {
  // 1. Get all stocks
  const { data: stocks, error: stocksError } = await supabase
    .from('stocks')
    .select(`
      id,
      name,
      ticker,
      base_price,
      sectors(name)
    `);

  if (stocksError) throw stocksError;

  // 2. Get yearly prices for this year
  const { data: prices, error: pricesError } = await supabase
    .from('yearly_prices')
    .select('*')
    .eq('year_id', yearId);

  if (pricesError) throw pricesError;

  // 3. Get summaries for this year
  const { data: summaries, error: summaryError } = await supabase
    .from('year_summary')
    .select('*')
    .eq('year_id', yearId);

  if (summaryError) throw summaryError;

  // 4. Merge manually (THIS IS THE CORRECT WAY)
  const formatted = stocks.map((stock: any) => ({
    ...stock,
    yearly_prices: prices.filter(
      (p: any) => p.stock_id === stock.id
    ),
    year_summary:
      summaries.find((s: any) => s.stock_id === stock.id) || null,
  }));

  return formatted;
}