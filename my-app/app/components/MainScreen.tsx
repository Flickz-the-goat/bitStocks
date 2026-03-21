"use client";

import { useState } from "react";
// import Graphs from "./Graphs";
// import Portfolio from "./Portfolio";
// import News from "./News";
import OtherPanel from "./OtherPanel";
import Header from "./Header";

export default function MainScreen() {
  const [activeView, setActiveView] = useState("home");

  const renderActiveView = () => {
    switch (activeView) {
    //   case "graphs":
    //     return <Graphs />;
    //   case "portfolio":
    //     return <Portfolio />;
    //   case "news":
    //     return <News />;
      default:
        return (
          <div className="text-center text-lg" style={{ color: 'var(--text-primary)' }}>
            Welcome to Bit Stock!
          </div>
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
                className="hover:opacity-80 px-6 py-2 rounded-md font-semibold transition"
                style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-accent)' }}
        >
          {option}
        </button>  ))
        }
      </div>

      {/* Main Screen */}
      <div className="p-6 flex flex-col min-w-0 rounded-md" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
        {renderActiveView()}
      </div>

      {/* Right Panel (OtherPanel) */}
      <OtherPanel />
    </div>
    </div>
  );
}