import { generateStockDataForYear } from '@/lib/db/market';

export async function POST(req: Request) {
  try {
    const { yearId } = await req.json();

    if (!yearId) {
      return Response.json(
        { error: 'Missing yearId' },
        { status: 400 }
      );
    }

    const result = await generateStockDataForYear(yearId);

    return Response.json(result);
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: 'Failed to generate stock data' },
      { status: 500 }
    );
  }
}