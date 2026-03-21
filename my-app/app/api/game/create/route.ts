import { createGame } from '@/lib/db/games';

export async function POST() {
  const userId = "ec09d3b5-8105-4e12-9edf-125857d0466e";
  const game = await createGame(userId);

  return Response.json(game);
}