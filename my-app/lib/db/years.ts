import { NewsEvent } from '@/types/gameType';
import { supabase } from '../supabase';
import { generateMonthlyPricesFromOpenClose } from './market';

export async function createYear(gameId: string, yearNumber: number, globalSummary: string) {
  const { data, error } = await supabase
    .from('years')
    .insert([{ game_id: gameId, year_number: yearNumber, global_summary: globalSummary }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function insertNetWorth(
  gameId: string,
  yearId: string,
  netWorth: number
) {
  const { error } = await supabase
    .from('net_worth_history')
    .insert([
      {
        game_id: gameId,
        year_id: yearId,
        net_worth: netWorth,
      },
    ]);

  if (error) throw error;
}
function resolveNewsImpacts(news: NewsEvent[]) {
  const sectorImpactMap: Record<string, number> = {};

  for (const event of news) {
    if (event.resolved) continue;

    const didHappen = Math.random() < event.probability;

    const impacts = didHappen
      ? event.sector_impacts_if_true
      : event.sector_impacts_if_false;

    if (!impacts) continue;

    // accumulate sector effects
    for (const [sector, impact] of Object.entries(impacts)) {
      if (!sectorImpactMap[sector]) {
        sectorImpactMap[sector] = 0;
      }
      sectorImpactMap[sector] += impact;
    }

    // mark resolved (optional DB update later)
    event.resolved = true;
    event.actual_outcome = impacts;
  }

  return sectorImpactMap;
}

async function calculateNetWorth(game: any, yearId: string) {

  // 2. Get portfolio
  const { data: portfolio, error: portfolioError } = await supabase
    .from('portfolio')
    .select('*')
    .eq('game_id', game.id);

  if (portfolioError) {
    console.log("Portfolio fetch error", portfolioError);
    return game.current_money;
  }

  // 3. Get stock values for this year
  const { data: summaries, error: summaryError } = await supabase
    .from('year_summary')
    .select('*')
    .eq('year_id', yearId);

  if (summaryError) {
    console.log("Summary fetch error", summaryError);
    return game.current_money;
  }

  // 4. Calculate stock value
  let stockValue = 0;

  for (const item of portfolio) {
    const summary = summaries.find(
      (s: any) => s.stock_id === item.stock_id
    );

    if (summary) {
      stockValue += item.shares * summary.close_price;
    }
  }


  return game.current_money + game.income + stockValue;
}

export async function addNetWorth(game: any, yearId: string) {
  const netWorth = await calculateNetWorth(game, yearId);

  const { error } = await supabase
    .from('net_worth_history')
    .insert({
      game_id: game.id,
      year_id: yearId,
      net_worth: netWorth,
    });

  if (error) {
    console.log("Net worth insert error", error);
  }
}

export async function nextYear({
  game,
  currentYear,
  news,
  stocks,
  lastYearSummaries,
  sectors,
  endYear,
}: any) {
  // 1. Resolve news → sector impacts
  console.log("resvolving news impacts")
  const sectorImpactMap = resolveNewsImpacts(news);

  const yearlyPriceRows: any[] = [];
  const yearlySummaryRows: any[] = [];

  console.log(sectorImpactMap)

  // 8. Create next year
  const nextYearNumber = currentYear.year_number + 1;
  console.log("Creating new year")
  const newYear = await createYear(
    game.id,
    nextYearNumber,
    "Year simulated based on global events"
  );
  console.log("New Year", newYear)
  console.log("Updating Stocks")
  // 2. Loop through stocks
  for (const stock of stocks) {
    const lastSummary = lastYearSummaries.find(
      (s: any) => s.stock_id === stock.id
    );

    const openPrice = lastSummary?.close_price || stock.base_price;

    // get sector name from sector_id
    const sector = sectors.find((s: any) => s.id === stock.sector_id);
    const sectorName = sector?.name;

    const sectorImpact = sectorImpactMap[sectorName] || 0;
    console.log(sectorImpact)
    // apply impact
    const closePrice = openPrice + (openPrice * (sectorImpact/100))
    // 3. Generate monthly prices
    const monthlyPrices = generateMonthlyPricesFromOpenClose(
      openPrice,
      closePrice
    );
  
    const high_price = Math.max(...monthlyPrices);
    const low_price = Math.min(...monthlyPrices);

    // 4. Push monthly rows
    monthlyPrices.forEach((price, index) => {
      yearlyPriceRows.push({
        stock_id: stock.id,
        year_id: newYear.id,
        month: index + 1,
        price,
      });
    });

    // 5. Push summary
    yearlySummaryRows.push({
      stock_id: stock.id,
      year_id: newYear.id,
      open_price: openPrice,
      close_price: closePrice,
      high_price,
      low_price,
    });
  }
  // 6. Insert into DB
  await supabase.from('yearly_prices').insert(yearlyPriceRows);
  await supabase.from('year_summary').insert(yearlySummaryRows);

  await addNetWorth(game, newYear.id)
  // 7. Update game money
  const updatedMoney = game.current_money + game.income;

  const {data, error }= await supabase
    .from('games')
    .update({ current_money: updatedMoney, current_year: nextYearNumber })
    .eq('id', game.id).select().single();

  // 9. Check end condition
  const finishGame = nextYearNumber >= endYear;
  if(!data || error) console.log(error)
  const newGame =  data;
  
  return {
    newGame,
    newYear,
    finishGame,
  };
}