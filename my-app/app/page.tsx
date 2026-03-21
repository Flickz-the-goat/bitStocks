"use client";
import { useState } from "react";
import { Game } from "@/types/gameType";
import MainScreen from "@/app/components/MainScreen";
import { HomeIcon } from "lucide-react";

export default function Home() {
	const [game, setGame] = useState<Game | null>(null);
	const [creatingGame, setCreatingGame] = useState(false);
	const [started, setStarted] = useState(false);
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
		console.log("Game Created");
		setGame(game)

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
			<button className="hover:cursor-pointer text-white" onClick={() => createGame()}>
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
        <span className="text-white">Starting Year:</span>{" "}
        <span className="">
			{game.start_year}
		</span>
      </p>

      <p>
        <span className="text-white">Starting Money:</span>{" "}
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
	{started && <MainScreen />}
    </div>
  );
}
