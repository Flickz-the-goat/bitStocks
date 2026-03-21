import { supabase } from '../supabase';

// Helper: generate smooth monthly prices
function generateMonthlyPrices(startPrice: number, endPrice: number) {
  const prices: number[] = [];

  for (let i = 0; i < 12; i++) {
    const t = i / 11; // interpolation (0 → 1)

    // linear trend
    const base = startPrice + (endPrice - startPrice) * t;

    // small randomness
    const noise = base * (Math.random() * 0.05 - 0.025); // ±2.5%

    prices.push(Number((base + noise).toFixed(2)));
  }

  return prices;
}

export async function generateStockDataForYear(yearId: string) {
  // 1. Get all stocks
  const { data: stocks, error } = await supabase
    .from('stocks')
    .select('*');

  if (error) throw error;

  const yearlyPriceRows: any[] = [];
  const yearlySummaryRows: any[] = [];

  for (const stock of stocks) {
    const basePrice = stock.base_price;

    // 2. Decide yearly movement (IMPORTANT)
    const growthFactor = 1 + (Math.random() * 0.4 - 0.2); // -20% to +20%
    const endPrice = basePrice * growthFactor;

    // 3. Generate 12 monthly prices
    const monthlyPrices = generateMonthlyPrices(basePrice, endPrice);

    // 4. Compute summary
    const open_price = monthlyPrices[0];
    const close_price = monthlyPrices[11];
    const high_price = Math.max(...monthlyPrices);
    const low_price = Math.min(...monthlyPrices);

    // 5. Push monthly rows
    monthlyPrices.forEach((price, index) => {
      yearlyPriceRows.push({
        stock_id: stock.id,
        year_id: yearId,
        month: index + 1,
        price,
      });
    });

    // 6. Push summary row
    yearlySummaryRows.push({
      stock_id: stock.id,
      year_id: yearId,
      open_price,
      close_price,
      high_price,
      low_price,
    });
  }

  // 7. Insert all at once (faster)
  const { error: priceError } = await supabase
    .from('yearly_prices')
    .insert(yearlyPriceRows);

  if (priceError) throw priceError;

  const { error: summaryError } = await supabase
    .from('year_summary')
    .insert(yearlySummaryRows);

  if (summaryError) throw summaryError;

  return {
    success: true,
    stocksProcessed: stocks.length,
  };
}