'use client';

import { Chart } from 'react-google-charts';

export default function StockModal({
  stock,
  onClose,
}: {
  stock: any;
  onClose: () => void;
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

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className="p-6 rounded-2xl w-[650px] relative shadow-2xl border"
        style={{
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          borderColor: 'var(--border-primary)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-lg transition hover:scale-110"
          style={{ color: 'var(--text-secondary)' }}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold">{stock.name}</h2>
        <p
          className="mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          {stock.ticker}
        </p>

        {prices.length > 0 ? (
          <Chart
            chartType="LineChart"
            width="100%"
            height="300px"
            data={chartData}
            options={options}
          />
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>
            No price data yet
          </p>
        )}

        {stock.year_summary && (
          <div
            className="mt-4 text-sm grid grid-cols-2 gap-3 p-3 rounded-xl"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <p>Open: ${stock.year_summary.open_price}</p>
            <p>Close: ${stock.year_summary.close_price}</p>
            <p>High: ${stock.year_summary.high_price}</p>
            <p>Low: ${stock.year_summary.low_price}</p>
          </div>
        )}
      </div>
    </div>
  );
}