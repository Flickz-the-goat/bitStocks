import { supabase } from '../supabase';

export async function getPortfolio(gameId: string) {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .eq('game_id', gameId);

  if (error) throw error;
  return data;
}

export async function buyStock(
  gameId: string,
  stockId: string,
  shares: number,
  price: number
) {
  const { data: existing } = await supabase
    .from('portfolio')
    .select('*')
    .eq('game_id', gameId)
    .eq('stock_id', stockId)
    .single();

  if (existing) {
    const newShares = existing.shares + shares;
    const newAvg =
      (existing.avg_buy_price * existing.shares + price * shares) /
      newShares;

    await supabase
      .from('portfolio')
      .update({
        shares: newShares,
        avg_buy_price: newAvg,
      })
      .eq('id', existing.id);
  } else {
    await supabase.from('portfolio').insert([
      {
        game_id: gameId,
        stock_id: stockId,
        shares,
        avg_buy_price: price,
      },
    ]);
  }
}

export async function sellStock(
  gameId: string,
  stockId: string,
  shares: number
) {
  const { data: existing } = await supabase
    .from('portfolio')
    .select('*')
    .eq('game_id', gameId)
    .eq('stock_id', stockId)
    .single();

  if (!existing) throw new Error('No stock owned');

  const newShares = existing.shares - shares;

  if (newShares <= 0) {
    await supabase.from('portfolio').delete().eq('id', existing.id);
  } else {
    await supabase
      .from('portfolio')
      .update({ shares: newShares })
      .eq('id', existing.id);
  }
}