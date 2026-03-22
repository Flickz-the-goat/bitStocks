"use client";

import { Game, Year, NewsEvent } from "@/types/gameType";
import ActionButton from "./ActionButton";

interface HomeScreenProps {
  game: Game | null;
  year: Year | null;
  news: NewsEvent[];
  setGame: (game: Game | null) => void 
  setYear: (year: Year | null) => void
  setNews: (news: NewsEvent[] | null) => void
  finishedGame: boolean;
  setFinishedGame: (finishedGame: boolean) => void;
}

export default function HomeScreen({ game, year, news, finishedGame, setFinishedGame, setGame,setYear, setNews }: HomeScreenProps) {
  if(!news || !game || !year) return
  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ color: 'var(--text-primary)' }}>
      {/* Top Bar */}
      <div className="flex justify-between items-center p-3 border-b" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}>
        <span className="text-sm font-medium">User</span>
        <span className="text-sm font-medium"> ${game?.current_money?.toLocaleString() || '0'}</span>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 p-6 overflow-y-auto space-y-8">
        {/* Current Year Display */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4 text-left">
            Year: {year?.year_number || 'Loading...'}
          </h1>
        </div>

        {/* Current Year Summary */}
        {year?.global_summary && (
          <div>
            <p className="text-lg leading-relaxed text-left mb-4" style={{ color: 'var(--text-secondary)' }}>
              {year.global_summary}
            </p>
          </div>
        )}

        {/* Placeholder for future years */}
        {!year?.global_summary && !news?.length && (
          <p className="text-lg text-left" style={{ color: 'var(--text-secondary)' }}>
            Welcome to Bit Stocks! Start your financial journey.
          </p>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-6 flex justify-center">
        <ActionButton game={game} currentYear={year} endYear={2030} news={news} setGame={setGame} setYear={setYear} setNews={setNews} setFinishedGame={setFinishedGame}/>

      </div>
    </div>
  );
}