"use client";

import { ChartNoAxesColumn, ChartNoAxesCombined, Lasso, Moon, Sun } from "lucide-react";
import { useTheme } from "../lib/ThemeContext";

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex justify-between items-center p-4 border-b" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}>
      <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
        <div className="inline-flex items-center gap-2">
        Bit Stocks <ChartNoAxesCombined />
        </div>
      </h1>
      <div className="flex gap-2">
        <button
          onClick={() => setTheme('white')}
          className={`px-3 py-1 rounded ${theme === 'white' ? 'bg-blue-500 text-white' : ''}`}
          style={{ backgroundColor: theme === 'white' ? 'var(--bg-accent)' : 'transparent', color: 'var(--text-primary)' }}
        >
          <Sun />
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-blue-500 text-white' : ''}`}
          style={{ backgroundColor: theme === 'dark' ? 'var(--bg-accent)' : 'transparent', color: 'var(--text-primary)' }}
        >
            <Moon />
        </button>
        <button
          onClick={() => setTheme('wildwest')}
          className={`px-3 py-1 rounded ${theme === 'wildwest' ? 'bg-blue-500 text-white' : ''}`}
          style={{ backgroundColor: theme === 'wildwest' ? 'var(--bg-accent)' : 'transparent', color: 'var(--text-primary)' }}
        >
          <Lasso />
        </button>
      </div>
    </header>
  );
}