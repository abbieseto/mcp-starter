import React from 'react';
import { Search, Sun, Moon, Bell, Bookmark, TrendingUp } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  onToggleWatchlist: () => void;
  watchlistCount: number;
  activeNavTab: string;
  onSelectNavTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  onToggleWatchlist,
  watchlistCount,
  activeNavTab,
  onSelectNavTab,
}) => {
  return (
    <header className={`sticky top-0 z-40 w-full border-b transition-colors ${
      darkMode ? 'bg-[#131722] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-neutral-200 text-neutral-800'
    }`}>
      {/* Strict 1-row, 3-zone Top Bar Contract */}
      <div className="max-w-[1720px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectNavTab('overview')}
            className="flex items-center gap-2 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            {/* TradingView Iconic Geometric Mark */}
            <div className="w-8 h-8 rounded bg-[#2962ff] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M4 17h4v-3H4v3zm0-5h4V9H4v3zm0-5h4V4H4v3zm6 10h4V4h-4v13zm6 0h4V9h-4v8z" />
              </svg>
            </div>
            <span className={`text-lg font-bold tracking-tight font-sans transition-colors ${
              darkMode ? 'text-white' : 'text-neutral-900'
            }`}>
              TradingView
            </span>
          </button>

          {/* Quick status indicator */}
          <div className="hidden xl:flex items-center gap-1.5 ml-3 pl-3 border-l border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
            <span>US Markets Regular Hours</span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Clean text links) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
          <button
            onClick={() => onSelectNavTab('overview')}
            className={`transition-colors hover:text-[#2962ff] ${
              activeNavTab === 'overview'
                ? darkMode ? 'text-white font-semibold' : 'text-neutral-950 font-semibold'
                : darkMode ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onSelectNavTab('indices')}
            className={`transition-colors hover:text-[#2962ff] ${
              activeNavTab === 'indices'
                ? darkMode ? 'text-white font-semibold' : 'text-neutral-950 font-semibold'
                : darkMode ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            Indices
          </button>
          <button
            onClick={() => onSelectNavTab('stocks')}
            className={`transition-colors hover:text-[#2962ff] ${
              activeNavTab === 'stocks'
                ? darkMode ? 'text-white font-semibold' : 'text-neutral-950 font-semibold'
                : darkMode ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            Stocks
          </button>
          <button
            onClick={() => onSelectNavTab('crypto')}
            className={`transition-colors hover:text-[#2962ff] ${
              activeNavTab === 'crypto'
                ? darkMode ? 'text-white font-semibold' : 'text-neutral-950 font-semibold'
                : darkMode ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            Crypto
          </button>
          <button
            onClick={() => onSelectNavTab('heatmap')}
            className={`transition-colors hover:text-[#2962ff] ${
              activeNavTab === 'heatmap'
                ? darkMode ? 'text-white font-semibold' : 'text-neutral-950 font-semibold'
                : darkMode ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            Heatmap
          </button>
          <button
            onClick={() => onSelectNavTab('news')}
            className={`transition-colors hover:text-[#2962ff] ${
              activeNavTab === 'news'
                ? darkMode ? 'text-white font-semibold' : 'text-neutral-950 font-semibold'
                : darkMode ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            News & Ideas
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              darkMode
                ? 'bg-[#1e222d] border-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc] hover:border-[#434651]'
                : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
            }`}
            title="Search markets, symbols, ideas (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search markets</span>
            <kbd className={`hidden md:inline-block px-1.5 py-0.5 text-[10px] rounded font-mono ${
              darkMode ? 'bg-[#131722] text-[#787b86]' : 'bg-white text-neutral-500 border border-neutral-200'
            }`}>
              ⌘K
            </kbd>
          </button>

          {/* Watchlist Drawer Toggle */}
          <button
            onClick={onToggleWatchlist}
            className={`relative p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-[#1e222d] text-[#d1d4dc]' : 'hover:bg-neutral-100 text-neutral-700'
            }`}
            title="Watchlist & alerts"
          >
            <Bookmark className="w-4 h-4" />
            {watchlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#2962ff] text-white text-[10px] font-bold flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-[#1e222d] text-[#d1d4dc]' : 'hover:bg-neutral-100 text-neutral-700'
            }`}
            title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
          </button>

          {/* User Sign In / Profile */}
          <div className="flex items-center gap-2 pl-1">
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#2962ff] text-white hover:bg-[#1e53e5] transition-colors whitespace-nowrap">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Launch Chart</span>
            </button>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase cursor-pointer border ${
              darkMode ? 'bg-[#2a2e39] border-[#363a45] text-white' : 'bg-neutral-200 border-neutral-300 text-neutral-800'
            }`} title="User Profile: Abigail">
              A
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
