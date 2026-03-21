"use client";

import { useEffect, useState } from "react";
import StockCard from "./StockCard";
import StockModal from "./StockModal";
import { getPortfolio } from "@/lib/db/portfolio";

export default function PortfolioScreen({
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
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<any | null>(null);

  // 🔹 Fetch all stocks
  useEffect(() => {
    const fetchStocks = async () => {
      const res = await fetch("/api/stocks/year", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yearId }),
      });

      const data = await res.json();
      setStocks(data);
    };

    if (yearId) fetchStocks();
  }, [yearId]);

  // 🔹 Fetch portfolio
  useEffect(() => {
    const fetchPortfolio = async () => {
      const data = await getPortfolio(gameId);
      setPortfolio(data || []);
    };

    if (gameId) fetchPortfolio();
  }, [gameId]);

  // 🔥 Merge stocks + portfolio
  const portfolioStocks = stocks
    .map((stock) => {
      const owned = portfolio.find(
        (p) => p.stock_id === stock.id
      );

      if (!owned) return null;

      return {
        ...stock,
        ownedShares: owned.shares,
        avgBuyPrice: owned.avg_buy_price,
      };
    })
    .filter(Boolean);

  return (
    <div
      className="p-4 h-full overflow-y-auto"
      style={{ color: "var(--text-primary)" }}
    >
      <h1 className="text-xl font-bold mb-4">Your Portfolio</h1>

      {portfolioStocks.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }}>
          You don’t own any stocks yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {portfolioStocks.map((stock: any) => (
            <StockCard
              key={stock.id}
              stock={stock}
              onClick={() => setSelectedStock(stock)}
            />
          ))}
        </div>
      )}

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