"use client"
import { useEffect, useState } from 'react';
import StockCard from './StockCard';
import StockModal from './StockModal';

export default function StockScreen({
  yearId,
  gameId,
  currentMoney,
  setGame,
}: {
  yearId: string;
  gameId: string;
  currentMoney: number;
  setGame: (game: any) => void;
}) {
  const [stocks, setStocks] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<any | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      const res = await fetch('/api/stocks/year', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yearId }),
      });

      const data = await res.json();
      setStocks(data);
    };

    if (yearId) fetchStocks();
  }, [yearId]);

  return (
    <div
      className="p-4 max-h-full overflow-y-scroll"
      style={{
        color: 'var(--text-primary)',
      }}
    >
      <h1 className="text-xl font-bold mb-4">Stocks</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stocks.map((stock) => (
          <StockCard
            key={stock.id}
            stock={stock}
            onClick={() => setSelectedStock(stock)}
          />
        ))}
      </div>

      {selectedStock && (
        <StockModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          gameId={gameId}
          yearId={yearId}
          currentMoney={currentMoney}
          setGame={setGame}
        />
      )}
    </div>
  );
}