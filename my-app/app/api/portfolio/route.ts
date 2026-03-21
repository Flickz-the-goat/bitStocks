import { getPortfolio } from '@/lib/db/portfolio';

export async function POST(req: Request) {
  const { gameId } = await req.json();
  const data = await getPortfolio(gameId);

  return Response.json(data);
}