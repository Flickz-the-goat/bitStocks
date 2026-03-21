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