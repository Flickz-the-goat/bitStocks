"use client";

import { useState } from "react";
// import Graphs from "./Graphs";
// import Portfolio from "./Portfolio";
// import News from "./News";
import OtherPanel from "./OtherPanel";
import Header from "./Header";
import HomeScreen from "./HomeScreen";
import { Game, Year, NewsEvent } from "@/types/gameType";
import NewsScreen from "./NewsScreen";
import StockScreen from "./StockScreen";
import { GamepadIcon } from "lucide-react";
import PortfolioScreen from "./PortfolioScreen";

interface MainScreenProps {
  game: Game | null;
  setGame: (game: Game | null) => void;
  year: Year | null;
  setYear: (year: Year | null) => void;
  news: NewsEvent[] | null;
  setNews: (news: NewsEvent[] | null) => void;
}

export default function MainScreen({ game, setGame, year, setYear, news, setNews }: MainScreenProps) {
  const [activeView, setActiveView] = useState("home");
  if(!game || !year || !news) return

  const renderActiveView = () => {
    switch (activeView) {
      case "graphs":
        return <StockScreen yearId={year.id} gameId={game.id} currentMoney={game.current_money} setGame={setGame}/>;
      case "portfolio":
         return <PortfolioScreen gameId={game.id} yearId={year.id} currentMoney={game.current_money} setGame={setGame} />;
    case "news":
         return <NewsScreen news={news} year={year}/>;
      default:
        return (
          <HomeScreen game={game} year={year} news={news} />
        );
    }
  };
  const options = ["home", "portfolio", "graphs", "news"];
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <div className="flex-1 grid grid-cols-[1fr_4fr_1fr] gap-2 p-2">
      {/* Left Menu */}
      <div className="p-4 flex flex-col gap-4 rounded-md" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
        {
        options.map((option) => (
            <button
                key={option} //just to avoid react warning, can be removed - calvin
                onClick={() => setActiveView(option)}
                className="hover:opacity-80 cursor-pointer px-6 py-2 rounded-md font-semibold transition"
                style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-accent)' }}
        >
          {option}
        </button>  ))
        }
      </div>

      {/* Main Screen */}
      <div className="max-h-[calc(100vh-80px)] p-4 flex flex-col min-w-0 rounded-md" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)'}}>
        {renderActiveView()}
      </div>

      {/* Right Panel (OtherPanel) */}
      <OtherPanel gameId={game.id} yearId={year.id} currentMoney={game.current_money}/>
    </div>
    </div>
  );
}