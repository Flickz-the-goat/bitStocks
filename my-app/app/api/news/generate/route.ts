import { createYear } from '@/lib/db/years';
import { insertNewsEvents } from '@/lib/db/news';

export async function POST(req: Request) {
  try {
    const { gameId, yearNumber, yearId } = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_AI_SERVICE_URL}/news/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year: yearNumber }),
    });

    if (!res.ok) throw new Error('Failed to fetch AI news');

    const data = await res.json();

    // 3. Insert into DB
    const insertedNews = await insertNewsEvents(
      yearId,
      data.events
    );

    return Response.json({
      news: insertedNews,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Failed to generate news' }, { status: 500 });
  }
}