import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { gameId } = await req.json();

    if (!gameId) {
      return Response.json({ error: 'Missing gameId' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('net_worth_history')
      .select('net_worth, year_id, years(year_number)')
      .eq('game_id', gameId)
      .order('year_id', { ascending: true });

    if (error) {
      throw error;
    }

    return Response.json(data);
  } catch (error) {
    console.error('Error fetching net worth history:', error);
    return Response.json({ error: 'Failed to fetch net worth history' }, { status: 500 });
  }
}
