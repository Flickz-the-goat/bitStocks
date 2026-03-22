'use client';

import { useEffect, useState, useMemo } from 'react';
import { Chart } from 'react-google-charts';
import { useTheme } from '@/app/lib/ThemeContext';

interface OtherPanelProps {
  gameId: string;
  currentMoney: number;
  yearId: string;
  currentYear: number;
}

async function fetchPortfolio(gameId: string) {
  const res = await fetch('/api/portfolio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId }),
  });
  if (!res.ok) throw new Error('Portfolio fetch failed');
  return res.json();
}

async function fetchAllStocks() {
  const res = await fetch('/api/stocks');
  if (!res.ok) throw new Error('Stocks fetch failed');
  return res.json();
}

async function fetchStockPrices(stockId: string, yearId: string) {
  const res = await fetch('/api/stocks/prices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stockId, yearId }),
  });
  if (!res.ok) throw new Error('Stock prices fetch failed');
  return res.json();
}

async function fetchNetWorthHistory(gameId: string) {
  const res = await fetch('/api/net-worth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId }),
  });
  if (!res.ok) throw new Error('Net worth fetch failed');
  return res.json();
}

async function fetchRecentTransactions(gameId: string) {
  const res = await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId }),
  });
  if (!res.ok) throw new Error('Transactions fetch failed');
  return res.json();
}

export default function OtherPanel({currentYear, gameId, yearId, currentMoney }: OtherPanelProps) {
  const { theme } = useTheme();

  // Use real color (no CSS vars for charts)
  const panelTextColor = theme === 'dark' ? '#ffffff' : '#121212';

  // Memo so charts update on theme change
  const chartTextColor = useMemo(() => panelTextColor, [panelTextColor]);

  const [portfolioData, setPortfolioData] = useState<any[]>([]);
  const [stocksMap, setStocksMap] = useState<Map<string, any>>(new Map());
  const [pricesMap, setPricesMap] = useState<Map<string, number>>(new Map());
  const [chartData, setChartData] = useState<(string | number)[][]>([]);
  const [netWorthData, setNetWorthData] = useState<(string | number)[][]>([['Year', 'Net Worth']]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [tumbleweeds, setTumbleweeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (theme === 'wildwest') {
      const randomTumble = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        top: `${10 + Math.floor(Math.random() * 70)}%`,
        duration: `${8 + Math.floor(Math.random() * 8)}s`,
        delay: `${(Math.random() * 3).toFixed(2)}s`,
        shift: `${20 + Math.floor(Math.random() * 80)}px`,
      }));
      setTumbleweeds(randomTumble);
    } else {
      setTumbleweeds([]);
    }
  }, [theme]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const portfolio = await fetchPortfolio(gameId);
        setPortfolioData(portfolio);

        const allStocks = await fetchAllStocks();
        const stockMap = new Map();
        allStocks.forEach((stock: any) => {
          stockMap.set(stock.id, stock);
        });
        setStocksMap(stockMap);

        const pricePromises = portfolio.map(async (item: any) => {
          const prices = await fetchStockPrices(item.stock_id, yearId);
          const latestPrice =
            prices.length > 0
              ? prices[prices.length - 1].price
              : item.avg_buy_price || 0;
          return { stockId: item.stock_id, price: latestPrice };
        });

        const priceResults = await Promise.all(pricePromises);
        const priceMap = new Map();
        priceResults.forEach(({ stockId, price }) => {
          priceMap.set(stockId, price);
        });
        setPricesMap(priceMap);

        const sectorValues = new Map<string, number>();
        portfolio.forEach((item: any) => {
          const stock = stockMap.get(item.stock_id);
          const sectorName =
            stock?.sectors?.name ||
            stock?.sector?.name ||
            stock?.sector_name ||
            item.sector_name ||
            'Unknown';

          const currentPrice =
            priceMap.get(item.stock_id) || item.avg_buy_price || 0;

          const value = item.shares * currentPrice;

          sectorValues.set(
            sectorName,
            (sectorValues.get(sectorName) || 0) + value
          );
        });

        const data: (string | number)[][] = [['Sector', 'Value']];
        data.push(['Cash', currentMoney]);
        sectorValues.forEach((value, sector) => {
          data.push([sector, value]);
        });
        setChartData(data);

        const netWorth = await fetchNetWorthHistory(gameId);
        const networthDataFormatted: (string | number)[][] = [['Year', 'Net Worth']];

        if (Array.isArray(netWorth) && netWorth.length > 0) {
          netWorth.forEach((item: any) => {
            const year = item?.years?.year_number ?? item?.year_id ?? 'N/A';
            networthDataFormatted.push([`Y${year}`, item.net_worth]);
          });
        } else {
          // fallback to current money if no net worth history data exists
          networthDataFormatted.push([`${currentYear}`, currentMoney]);
        }

        setNetWorthData(networthDataFormatted);

        const txs = await fetchRecentTransactions(gameId);
        setTransactions(Array.isArray(txs) ? txs.slice(0, 5) : []);
      } catch (error) {
        console.error(error);
        setError((error as Error)?.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    if (gameId && yearId) fetchData();
  }, [gameId, yearId, currentMoney]);

  // UPDATED CHART OPTIONS
  const options = {
  backgroundColor: 'transparent',
  legend: 'none',
  pieSliceTextStyle: { color: panelTextColor },
};

  const netWorthOptions = {
  backgroundColor: 'transparent',
  hAxis: {
    textStyle: { color: panelTextColor },
    titleTextStyle: { color: panelTextColor },
  },
  vAxis: {
    textStyle: { color: panelTextColor },
    titleTextStyle: { color: panelTextColor },
  },
  legend: 'none',
};

  return (
    <div
      className="w-84 p-4 flex flex-col gap-4 rounded-xl"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        color: panelTextColor,
      }}
    >
      {/* Container 1 - Pie Chart */}
      <div className="flex-1 rounded-xl p-4 shadow-md flex flex-col border border-gray-300" style={{ backgroundColor: 'var(--bg-accent)', color: panelTextColor }}>
        {loading ? (
          <span>Loading...</span>
        ) : error ? (
          <span>Error: {error}</span>
        ) : (
          <Chart
            key={theme}
            chartType="PieChart"
            width="100%"
            height="200px"
            data={chartData}
            options={options}
          />
        )}
      </div>

      {/* Container 2 - Net Worth Line Chart */}
      <div className="flex-1 rounded-xl p-4 shadow-md flex flex-col border border-gray-300" style={{ backgroundColor: 'var(--bg-accent)', color: panelTextColor }}>
        <h2 className="text-sm font-bold mb-2" style={{ color: panelTextColor }}>Net Worth History</h2>
        {netWorthData.length > 1 ? (
          <Chart
            chartType="LineChart"
            width="100%"
            height="200px"
            data={netWorthData}
            options={netWorthOptions}
          />
        ) : (
          <span className="text-gray-600">No net worth history</span>
        )}
      </div>

      {/* Container 3 - Recent Transactions */}
<div
  className="flex-1 rounded-xl p-4 shadow-md flex flex-col border border-gray-300"
  style={{ backgroundColor: 'var(--bg-accent)', color: panelTextColor }}
>
  <h3 className="font-bold text-sm mb-3" style={{ color: panelTextColor }}>
    Recent Transactions
  </h3>

  <div className="flex flex-col gap-2 max-h-44 overflow-y-auto">
    {transactions.length > 0 ? (
      transactions.map((tx) => (
        <div
          key={tx.id}
          className="text-xs p-2 rounded border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            color: panelTextColor,
          }}
        >
          <span className="font-bold">{tx.type.toUpperCase()}</span>
          <span> {tx.shares} shares of </span>
          <span className="font-semibold">
            {tx.stocks?.ticker || tx.stock_id}
          </span>
          <span> @ ${tx.price.toLocaleString()}</span>
        </div>
      ))
    ) : (
      <span>No transactions</span>
    )}
  </div>
</div>
    </div>
  );
}