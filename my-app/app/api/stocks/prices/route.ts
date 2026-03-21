import { getStockPrices } from '@/lib/db/stocks';

export async function POST(req: Request) {
  try {
    const { stockId, yearId } = await req.json();

    if (!stockId || !yearId) {
      return Response.json({ error: 'Missing stockId or yearId' }, { status: 400 });
    }

    const prices = await getStockPrices(stockId, yearId);
    return Response.json(prices);
  } catch (error) {
    console.error('Error fetching stock prices:', error);
    return Response.json({ error: 'Failed to fetch stock prices' }, { status: 500 });
  }
}
