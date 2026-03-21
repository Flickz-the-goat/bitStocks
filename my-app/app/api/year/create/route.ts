import { createYear } from '@/lib/db/years';

export async function POST(req: Request) {
  try {
    const { gameId, yearNumber, globalSummary } = await req.json();

    console.log(gameId, yearNumber, globalSummary)
    if (!gameId || yearNumber === undefined) {
      return Response.json(
        { error: 'Missing gameId or yearNumber' },
        { status: 400 }
      );
    }

    const year = await createYear(gameId, yearNumber, globalSummary);

    return Response.json(year);
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: 'Failed to create year' },
      { status: 500 }
    );
  }
}