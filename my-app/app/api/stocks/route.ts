import { getAllStocks } from '@/lib/db/stocks';

export async function GET() {
  const stocks = await getAllStocks();
  return Response.json(stocks);
}