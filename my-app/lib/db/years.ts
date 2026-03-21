import { supabase } from '../supabase';

export async function createYear(gameId: string, yearNumber: number) {
  const { data, error } = await supabase
    .from('years')
    .insert([{ game_id: gameId, year_number: yearNumber }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function insertNetWorth(
  gameId: string,
  yearId: string,
  netWorth: number
) {
  const { error } = await supabase
    .from('net_worth_history')
    .insert([
      {
        game_id: gameId,
        year_id: yearId,
        net_worth: netWorth,
      },
    ]);

  if (error) throw error;
}