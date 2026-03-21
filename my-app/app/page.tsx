"use client";
import { useState } from "react";
import { Game, NewsEvent, Year } from "@/types/gameType";
import MainScreen from "@/app/components/MainScreen";
import { HomeIcon } from "lucide-react";

export default function Home() {
	const [game, setGame] = useState<Game | null>(null);
	const [year, setYear] = useState<Year | null>(null);
	const [news, setNews] = useState<NewsEvent[] | null>(null)
	const [creatingGame, setCreatingGame] = useState(false);
	const [started, setStarted] = useState(false);

	const generateNews = async (gameId: string, yearNumber: number, yearId: string) => {
	  try {
		const res = await fetch('/api/news/generate', {
		  method: 'POST',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify({ gameId, yearNumber, yearId }),
		});

		if (!res.ok) throw new Error('Failed to generate news');

		const data = await res.json();

		return data;
	  } catch (err) {
		console.error(err);
		return null;
	  }
	};

	const createYear = async (gameId: string, yearNumber: number, globalSummary: string) => {
	  try {
		const res = await fetch('/api/year/create', {
		  method: 'POST',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify({ gameId, yearNumber, globalSummary }),
		});

		if (!res.ok) throw new Error('Failed to create year');

		const year = await res.json();
		return year;
	  } catch (err) {
		console.error(err);
		return null;
	  }
	};

	const generateMarket = async (yearId: string) => {
	const res = await fetch('/api/market/generate', {
		method: 'POST',
		headers: {
		'Content-Type': 'application/json',
		},
		body: JSON.stringify({ yearId }),
	});
	return await res.json();
	};
	const createGame = async () => {
		setCreatingGame(true);
		const res = await fetch("/api/game/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		
		if(!res.ok){
			throw new Error("Failed to create game");
		}
		const game = await res.json();

		setCreatingGame(false)
		console.log(game);
		setGame(game)
		const globalSummary = `Welcome to your new world, your goal is to amass as much money as possible. You are lucky enough to start with ${game.starting_money} and you have a solid income of ${game.income}. Good Luck! on your journey and dont forget to check the NEWS!`
		const year = await createYear(game.id, game.current_year, globalSummary); 
		setYear(year);
		console.log(year)
		const news = await generateNews(game.id, year.year_number, year.id); 
		setNews(news.news)
		console.log(news)
		const success = await generateMarket(year.id);
		console.log(success)
	}
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
	{
		creatingGame ? (
  <div className="flex flex-col items-center justify-center gap-6 text-center">
    
    {/* Spinner */}
    <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
    
    {/* Main Text */}
    <p className="text-lg font-semibold text-white">
      Creating Your Market...
    </p>

    {/* Sub Text (immersive) */}
    <p className="text-gray-400 text-sm animate-pulse">
      Simulating economy • Generating stocks • Preparing events
    </p>

  </div>
) : null
	}
	{
	!creatingGame && !started && !game && (
		<div className=" px-6 py-3 rounded-md font-semibold transition shadow-lg">
			<button className="hover:cursor-pointer" onClick={() => createGame()}>
				CREATE GAME
			</button>
		</div>)
	}
	
	{
	game && !started && (
  		<div className="flex flex-col items-center justify-center gap-6 text-center">
    
    {/* Title */}
    <h2 className="text-3xl font-bold">
      Game Ready
    </h2>

    {/* Info Card */}
    <div className="p-6 rounded-xl shadow-md w-80 text-left">

      <p className="mb-2">
        <span className="">Starting Year:</span>{" "}
        <span className="">
			{game.start_year}
		</span>
      </p>

      <p>
        <span className="">Starting Money:</span>{" "}
        <span className="">
			${game.starting_money}
		</span>
	  	</p>
    </div>

    {/* Start Button */}
    <button
      onClick={() => setStarted(true)}
      className=" px-6 py-3 rounded-xl font-semibold transition shadow-lg"
    >
      Enter Game →
    </button>

  	</div>
	)}

	{/* Main Screen */}
	{started && <MainScreen game={game} setGame={setGame} year={year} setYear={setYear} news={news} setNews={setNews} 
	/>}
    </div>
  );
}
