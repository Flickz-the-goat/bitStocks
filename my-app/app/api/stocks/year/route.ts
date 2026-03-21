import { getStocksWithYearData } from '@/lib/db/stocks';

export async function POST(req: Request) {
  try {
    const { yearId } = await req.json();

    if (!yearId) {
      return Response.json(
        { error: 'Missing yearId' },
        { status: 400 }
      );
    }

    const stocks = await getStocksWithYearData(yearId);

    return Response.json(stocks);
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: 'Failed to fetch stocks' },
      { status: 500 }
    );
  }
}