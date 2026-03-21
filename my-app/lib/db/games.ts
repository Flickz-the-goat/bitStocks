import { supabase } from '../supabase';

export async function createGame(userId: string) {
  const { data, error } = await supabase
    .from('games')
    .insert([
      {
        user_id: userId,
        start_year: 2025,
        current_year: 2025,
        starting_money: 10000,
        current_money: 10000,
        income: 2000,
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getGame(userId: string) {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateGameMoney(gameId: string, money: number) {
  const { error } = await supabase
    .from('games')
    .update({ current_money: money })
    .eq('id', gameId);

  if (error) throw error;
}