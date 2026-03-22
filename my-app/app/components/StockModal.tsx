'use client';

import { useState } from 'react';
import { Chart } from 'react-google-charts';
import { createTransaction } from '@/lib/db/transactions';
import { updateGameMoney } from '@/lib/db/games';
import { buyStock, sellStock } from '@/lib/db/portfolio';

export default function StockModal({
  stock,
  onClose,
  gameId,
  yearId,
  currentMoney,
  setGame,
}: {
  stock: any;
  onClose: () => void;
  gameId: string;
  yearId: string;
  currentMoney: number;
  setGame: (game: any) => void;
}) {
  const prices = stock.yearly_prices || [];

  const chartData = [
    ['Month', 'Price'],
    ...prices.map((p: any) => [`M${p.month}`, p.price]),
  ];

  const options = {
    title: `${stock.name} Price`,
    curveType: 'function',
    legend: { position: 'none' },
    backgroundColor: 'transparent',
  };

  const [shares, setShares] = useState(0);
  const [loading, setLoading] = useState(false);

  const latestPrice =
    prices?.[prices.length - 1]?.price || 0;

  const totalCost = shares * latestPrice;

    const ownedShares = stock.ownedShares ?? 0;
    const avgBuyPrice = stock.avgBuyPrice ?? 0;

    // total value if sold now
    const currentValue = ownedShares * latestPrice;

    // total cost basis
    const totalInvested = ownedShares * avgBuyPrice;

    // profit / loss
    const profit = currentValue - totalInvested; 
  const percentReturn =
  totalInvested > 0 ? (profit / totalInvested) * 100 : 0;

  // 🔥 BUY
  const handleBuy = async () => {
    if (shares <= 0) return;

    if (totalCost > currentMoney) {
      alert('Not enough money');
      return;
    }

    try {
      setLoading(true);

      await buyStock(gameId, stock.id, shares, latestPrice);

      await createTransaction(
        gameId,
        stock.id,
        'buy',
        shares,
        latestPrice,
        yearId
      );

      const newMoney = currentMoney - totalCost
      await updateGameMoney(gameId, newMoney);

      
    // 🔥 instant UI update
    setGame((prev: any) => ({
      ...prev,
      current_money: newMoney,
    }));
          onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SELL
  const handleSell = async () => {
    if (shares <= 0) return;

    try {
      setLoading(true);

      await sellStock(gameId, stock.id, shares);

      await createTransaction(
        gameId,
        stock.id,
        'sell',
        shares,
        latestPrice,
        yearId
      );

      await updateGameMoney(gameId, currentMoney + totalCost);

      const newMoney = currentMoney + totalCost;

    await updateGameMoney(gameId, newMoney);

    setGame((prev: any) => ({
      ...prev,
      current_money: newMoney,
    }));

      onClose();
    } catch (err) {
      alert('Not enough shares to sell');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 ">
      <div
        className="p-6 rounded-2xl w-[650px] relative shadow-2xl border overflow-scroll"
        style={{
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          borderColor: 'var(--border-primary)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-lg hover:scale-110 transition"
          style={{ color: 'var(--text-secondary)' }}
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold">{stock.name}</h2>
        <p
          className="mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          {stock.ticker}
        </p>

        {/* Chart */}
        {prices.length > 0 ? (
          <Chart
            chartType="LineChart"
            width="100%"
            height="200px"
            data={chartData}
            options={options}
          />
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>
            No price data yet
          </p>
        )}

        {/* Summary */}
        {stock.year_summary && (
          <div
            className="mt-4 text-sm grid grid-cols-2 gap-3 p-3 rounded-xl"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
        <p>Open: ${stock.year_summary.open_price.toFixed(2)}</p>
        <p>Close: ${stock.year_summary.close_price.toFixed(2)}</p>
        <p>High: ${stock.year_summary.high_price.toFixed(2)}</p>
        <p>Low: ${stock.year_summary.low_price.toFixed(2)}</p>         
        </div>
            )}
        
            {ownedShares > 0 && (
      <div
        className="mt-4 p-3 rounded-xl text-sm space-y-1"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <p>Shares Owned: {ownedShares}</p>
        <p>Avg Buy Price: ${avgBuyPrice.toFixed(2)}</p>
        <p>Current Value: ${currentValue.toFixed(2)}</p>
        <p
            style={{
                color: percentReturn >= 0 ? '#22c55e' : '#ef4444',
            }}
            >
            Return: {percentReturn.toFixed(2)}%
            </p>
        <p
          style={{
            color: profit >= 0 ? '#22c55e' : '#ef4444',
            fontWeight: '600',
          }}
        >
          {profit >= 0 ? 'Profit' : 'Loss'}: ${profit.toFixed(2)}
        </p>
      </div>
    )}

        {/* 🔥 BUY / SELL PANEL */}
        <div
          className="mt-6 p-4 rounded-xl border space-y-3"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
          }}
        >
          <div className="flex justify-between text-sm">
            <span>Price:</span>
            <span>${latestPrice}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Your Money:</span>
            <span>${currentMoney}</span>
          </div>

          <input
            type="number"
            min={0}
            value={shares}
            onChange={(e) => setShares(Number(e.target.value))}
            placeholder="Shares"
            className="w-full p-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          />

          <div className="flex justify-between text-sm">
            <span>Total:</span>
            <span>${totalCost}</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleBuy}
              disabled={loading}
              className="flex-1 py-2 rounded-lg font-semibold"
              style={{ backgroundColor: '#22c55e', color: 'white' }}
            >
              Buy
            </button>

            <button
              onClick={handleSell}
              disabled={loading}
              className="flex-1 py-2 rounded-lg font-semibold"
              style={{ backgroundColor: '#ef4444', color: 'white' }}
            >
              Sell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}