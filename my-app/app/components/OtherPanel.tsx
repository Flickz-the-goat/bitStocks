'use client';

import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

interface OtherPanelProps {
  gameId: string;
  currentMoney: number;
  yearId: string;
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

export default function OtherPanel({ gameId, yearId, currentMoney }: OtherPanelProps) {
  const [portfolioData, setPortfolioData] = useState<any[]>([]);
  const [stocksMap, setStocksMap] = useState<Map<string, any>>(new Map());
  const [pricesMap, setPricesMap] = useState<Map<string, number>>(new Map());
  const [chartData, setChartData] = useState<(string | number)[][]>([]);
  const [netWorthData, setNetWorthData] = useState<(string | number)[][]>([['Year', 'Net Worth']]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch portfolio
        const portfolio = await fetchPortfolio(gameId);
        console.log('OtherPanel portfolio', portfolio);
        setPortfolioData(portfolio);

        // Fetch all stocks with sectors
        const allStocks = await fetchAllStocks();
        console.log('OtherPanel allStocks', allStocks);
        const stockMap = new Map();
        allStocks.forEach((stock: any) => {
          stockMap.set(stock.id, stock);
        });
        setStocksMap(stockMap);

        // Fetch prices for portfolio stocks
        const pricePromises = portfolio.map(async (item: any) => {
          const prices = await fetchStockPrices(item.stock_id, yearId);
          const latestPrice = prices.length > 0 ? prices[prices.length - 1].price : item.avg_buy_price || 0;
          return { stockId: item.stock_id, price: latestPrice };
        });
        const priceResults = await Promise.all(pricePromises);
        const priceMap = new Map();
        priceResults.forEach(({ stockId, price }) => {
          priceMap.set(stockId, price);
        });
        setPricesMap(priceMap);

        // Calculate sector values
        const sectorValues = new Map<string, number>();
        portfolio.forEach((item: any) => {
          const stock = stockMap.get(item.stock_id);
          const sectorName =
            stock?.sectors?.name || stock?.sector?.name || stock?.sector_name || item.sector_name || 'Unknown';
          const currentPrice = priceMap.get(item.stock_id) || item.avg_buy_price || 0;
          const value = item.shares * currentPrice;
          sectorValues.set(sectorName, (sectorValues.get(sectorName) || 0) + value);
        });

        // Prepare pie chart data (sector breakdown)
        const data: (string | number)[][] = [['Sector', 'Value']];
        data.push(['Cash', currentMoney]);
        sectorValues.forEach((value, sector) => {
          data.push([sector, value]);
        });
        console.log('OtherPanel chartData', data);
        setChartData(data);

        // Prepare net worth chart data
        const netWorth = await fetchNetWorthHistory(gameId);
        console.log('OtherPanel netWorth', netWorth);
        const networthDataFormatted: (string | number)[][] = [['Year', 'Net Worth']];
        if (Array.isArray(netWorth) && netWorth.length > 0) {
          netWorth.forEach((item: any) => {
            const year = item?.years?.year_number ?? item?.year_id ?? 'N/A';
            networthDataFormatted.push([`Y${year}`, item.net_worth]);
          });
        } else {
          // fallback to current money if no net worth history data exists
          networthDataFormatted.push([`Y${yearId}`, currentMoney]);
        }
        setNetWorthData(networthDataFormatted);

        // Prepare recent transactions data
        const txs = await fetchRecentTransactions(gameId);
        const firstFiveTxs = Array.isArray(txs) ? txs.slice(0, 5) : [];
        console.log('OtherPanel transactions', txs);
        setTransactions(firstFiveTxs);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError((error as Error)?.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    if (gameId && yearId) {
      fetchData();
    }
  }, [gameId, yearId, currentMoney]);

  const options = {
    title: 'Portfolio by Sector',
    backgroundColor: 'transparent',
    legend: { position: 'none' },
    chartArea: { width: '90%', height: '90%' },
    titleTextStyle: { color: 'var(--text-primary)' },
    pieSliceTextStyle: { color: 'var(--text-primary)' },
  };

  const netWorthOptions = {
    title: 'Net Worth History',
    backgroundColor: 'transparent',
    hAxis: { title: 'Year', textStyle: { color: 'var(--text-primary)' }, titleTextStyle: { color: 'var(--text-primary)' } },
    vAxis: { title: 'Net Worth', textStyle: { color: 'var(--text-primary)' }, titleTextStyle: { color: 'var(--text-primary)' } },
    legend: { position: 'none' },
  };

  return (
    <div className="w-84 p-4 flex flex-col gap-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
      {/* Container 1 - Pie Chart */}
      <div className="flex-1 rounded-xl p-4 shadow-md flex items-center justify-center" style={{ backgroundColor: 'var(--bg-accent)', color: 'var(--text-primary)' }}>
        {loading ? (
          <span>Loading...</span>
        ) : error ? (
          <span>Error: {error}</span>
        ) : chartData.length >= 1 ? (
          <Chart
            chartType="PieChart"
            width="100%"
            height="200px"
            data={chartData}
            options={options}
          />
        ) : (
          <span>No portfolio data</span>
        )}
      </div>

      {/* Container 2 - Net Worth Line Chart */}
      <div className="flex-1 rounded-xl p-4 shadow-md" style={{ backgroundColor: 'var(--bg-accent)', color: 'var(--text-primary)' }}>
        {netWorthData.length > 1 ? (
          <Chart
            chartType="LineChart"
            width="100%"
            height="200px"
            data={netWorthData}
            options={netWorthOptions}
          />
        ) : (
          <span>No net worth history</span>
        )}
      </div>

      {/* Container 3 - Recent Transactions */}
      <div className="flex-1 rounded-xl p-4 shadow-md" style={{ backgroundColor: 'var(--bg-accent)', color: 'var(--text-primary)' }}>
        <h3 className="font-semibold mb-2">Recent Transactions</h3>
        <div className="flex flex-col gap-2 max-h-44 overflow-y-auto">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <div key={tx.id} className="text-sm">
                <span className="font-medium">{tx.type.toUpperCase()}</span> {tx.shares} shares of
                <span className="font-semibold"> {tx.stocks?.ticker || tx.stock_id}</span> @ ${tx.price.toLocaleString()}
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