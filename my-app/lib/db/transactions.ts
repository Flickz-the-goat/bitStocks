import { supabase } from '../supabase';

export async function createTransaction(
  gameId: string,
  stockId: string,
  type: 'buy' | 'sell',
  shares: number,
  price: number,
  yearId: string
) {
  const { error } = await supabase.from('transactions').insert([
    {
      game_id: gameId,
      stock_id: stockId,
      type,
      shares,
      price,
      year_id: yearId,
    },
  ]);

  if (error) throw error;
}