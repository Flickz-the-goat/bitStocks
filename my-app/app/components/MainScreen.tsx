"use client";

import { useState } from "react";
// import Graphs from "./Graphs";
// import Portfolio from "./Portfolio";
// import News from "./News";
import OtherPanel from "./OtherPanel";

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
          <div className="text-white text-center text-lg">
            Welcome to Bit Stock!
          </div>
        );
    }
  };
  const options = ["home", "portfolio", "graphs", "news"];
  return (
    <div className="flex min-h-screen w-full gap-2">
      {/* Left Menu */}
      <div className="w-48 p-4 flex flex-col gap-4 rounded-md border-1 border-gray-700">
        {
        options.map((option) => (
            <button
                key={option} //just to avoid react warning, can be removed - calvin
                onClick={() => setActiveView(option)}
                className=" hover:bg-gray-200 hover:cursor-pointer px-6 py-2 rounded-md font-semibold transition text-gray600"
        >
          {option}
        </button> ))
        }
      </div>

      {/* Main Screen */}
      <div className="flex-1 p-6 flex flex-col min-w-0 rounded-md border-1 border-gray-700">
        {renderActiveView()}
      </div>

      {/* Right Panel (OtherPanel) */}
      <OtherPanel />
    </div>
  );
}