"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { getAllStocks, getSectors } from "@/lib/db/stocks";
import { nextYear } from "@/lib/db/years";

interface ActionButtonProps {
  game: any;
  currentYear: any;
  news: any[];
  endYear: number;

  setFinishedGame: (finishedGame: boolean) => void;
  setGame: (game: any) => void;
  setYear: (year: any) => void;
  setNews: (news: any[]) => void;
}

export default function ActionButton({
  game,
  currentYear,
  news,
  endYear,
  setGame,
  setYear,
  setNews,
  setFinishedGame,
}: ActionButtonProps) {
  const [loading, setLoading] = useState(false);

  // ✅ get last year's summaries
  const fetchLastYearSummaries = async () => {
    const { data, error } = await supabase
      .from("year_summary")
      .select("*")
      .eq("year_id", currentYear.id);

    if (error) throw error;
    return data;
  };

  // ✅ generate news for new year
  const generateNews = async (gameId: string, yearNumber: number, yearId: string) => {
    const res = await fetch("/api/news/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId,
        yearNumber,
        yearId,
      }),
    });

    if (!res.ok) throw new Error("Failed to generate news");

    const data = await res.json();
    return data.news;
  };

  const handleNextYear = async () => {
    if (loading) return;

    try {
      setLoading(true);

      // 1️⃣ get last year summaries
      const lastYearSummaries = await fetchLastYearSummaries();
      const stocks = await getAllStocks();
      const sectors = await getSectors();

      // 2️⃣ run simulation
      const { newGame, newYear, finishGame } = await nextYear({
        game,
        currentYear,
        news,
        stocks,
        lastYearSummaries,
        sectors,
        endYear,
      });

      // 4️⃣ move to next year
      setYear(newYear);
     // 3️⃣ update game money locally
      setGame(newGame);

      // 5️⃣ generate NEW news for next year
      const newNews = await generateNews(
        game.id,
        newYear.year_number,
        newYear.id
      );

      setNews(newNews);

      // 6️⃣ optional: handle game end
      if (finishGame) {
        console.log("Game Finished");
        setFinishedGame(true)
      }

    } catch (err) {
      console.error("Next year failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleNextYear}
      disabled={loading}
      className={`w-24 h-16 md-4 rounded-full transition-all duration-200 flex items-center justify-center text-xs font-medium ${
        loading
          ? "opacity-50 cursor-not-allowed"
          : "hover:scale-105 cursor-pointer hover:opacity-90"
      }`}
      style={{
        backgroundColor: loading ? "var(--bg-secondary)" : "var(--bg-accent)",
        color: "var(--text-primary)",
        border: `2px solid ${
          loading ? "var(--border-primary)" : "var(--bg-accent)"
        }`,
      }}
    >
      {loading ? "..." : "Next Year"}
    </button>
  );
}