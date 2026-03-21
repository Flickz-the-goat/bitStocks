export default function NewsScreen(){
const generateNews = async (gameId: string, yearNumber: number) => {
  try {
    const res = await fetch('/api/news/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, yearNumber }),
    });

    if (!res.ok) throw new Error('Failed to generate news');

    const data = await res.json();

    console.log('News + Year:', data);

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
    return (
        <div>
            <div></div>
        </div>
    )
}