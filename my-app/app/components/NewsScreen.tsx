import { Year, NewsEvent } from "@/types/gameType";
import { useState } from "react";

interface NewsScreenProps{
  year: Year | null;
  news: NewsEvent[] | null;
}
export default function NewsScreen({year, news}: NewsScreenProps){
    const [selectedNews, setSelectedNews] = useState<NewsEvent | null>(null);

    return (
    <div className="w-full h-full overflow-y-scroll space-y-2">
      {news?.map((n) => {
        const sectors = Object.keys(n.sector_impacts_if_true || {});
        return (
          <div
            key={n.id}
            className="bg-(--bg-accent) hover:bg-(--bg-secondary) transition cursor-pointer rounded-md p-2 border-1"
            onClick={() => setSelectedNews(n)} // optional modal/expand
          >
            {/* Title + Probability */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                {n.title || "Untitled Event"}
              </h2>

              <span className="text-sm px-2 py-1 rounded-full bg-black text-white">
                {Math.round(n.probability * 100)}%
              </span>
            </div>

            {/* Sector tags */}
            <div className="flex flex-wrap gap-2">
              {sectors.length > 0 ? (
                sectors.map((sector) => (
                  <span
                    key={sector}
                    className="text-xs px-2 py-1 rounded-full bg-(--bg-accent)"
                  >
                    {sector}
                  </span>
                ))
              ) : (
                <span className="text-xs text-(--text-primary)">
                  No sector impact listed
                </span>
              )}
            </div>
          </div>
        );
      })}

    {selectedNews && (
      <div className="fixed inset-0 bg-(--bg-secondary)/60 flex items-center justify-center z-50">
        <div className="bg-(--bg-primary) rounded-2xl p-6 max-w-lg w-full shadow-xl">
          
          <h2 className="text-xl text-(--text-primary) font-bold mb-2">
            {selectedNews.title}
          </h2>

          <p className="text-(--text-secondary) mb-4">
            {selectedNews.description}
          </p>

          <div className="mb-4">
            <span className="font-semibold">Probability: </span>
            {Math.round(selectedNews.probability * 100)}%
          </div>

          <button
            onClick={() => setSelectedNews(null)}
            className="mt-2 px-2 py-2 bg-(--bg-secondary) text-(--text-secondary) rounded-lg border hover:cursor-pointer hover:bg-(--bg-accent) hover:text-(--text-primary)"
          >
            Close
          </button>
        </div>
      </div>
    )}
    </div>
)
}