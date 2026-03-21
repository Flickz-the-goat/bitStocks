import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { gameId } = await req.json();

    if (!gameId) {
      return Response.json({ error: 'Missing gameId' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*, stocks(name, ticker)')
      .eq('game_id', gameId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      throw error;
    }

    return Response.json(data);
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    return Response.json({ error: 'Failed to fetch recent transactions' }, { status: 500 });
  }
}
