/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_MARKETS } from './data/marketData';
import { MarketAsset, AssetCategory } from './types/market';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { MarketsSubNav, SubNavId } from './components/MarketsSubNav';
import { OverviewHero } from './components/OverviewHero';
import { MarketsTableSection } from './components/MarketsTableSection';
import { MarketHeatmap } from './components/MarketHeatmap';
import { TechnicalGaugeCard } from './components/TechnicalGaugeCard';
import { EconomicCalendar } from './components/EconomicCalendar';
import { MarketNewsAndIdeas } from './components/MarketNewsAndIdeas';
import { SuperChartModal } from './components/SuperChartModal';
import { WatchlistSidebar } from './components/WatchlistSidebar';
import { SymbolSearchModal } from './components/SymbolSearchModal';
import { ShieldCheck, TrendingUp, HelpCircle } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeSubNav, setActiveSubNav] = useState<SubNavId>('overview');
  const [assets, setAssets] = useState<MarketAsset[]>(INITIAL_MARKETS);
  const [activeAssetForChart, setActiveAssetForChart] = useState<MarketAsset | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [watchlist, setWatchlist] = useState<string[]>(['SPX', 'NDX', 'BTCUSD', 'NVDA', 'AAPL', 'GOLD']);

  // Real-time market tick simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prev) =>
        prev.map((asset) => {
          // Update 1 in 3 assets randomly
          if (Math.random() > 0.35) return asset;

          const deltaFactor = (Math.random() - 0.49) * 0.0015;
          const newPrice = Math.max(0.01, asset.price * (1 + deltaFactor));
          const priceDiff = newPrice - asset.prevClose;
          const newPct = (priceDiff / asset.prevClose) * 100;

          // Update sparkline with new price
          const updatedSpark = [...asset.sparkline.slice(1), Number(newPrice.toFixed(2))];

          return {
            ...asset,
            price: Number(newPrice.toFixed(asset.price < 2 ? 4 : 2)),
            change: Number(priceDiff.toFixed(2)),
            changePercent: Number(newPct.toFixed(2)),
            sparkline: updatedSpark,
            dayRange: {
              low: Math.min(asset.dayRange.low, newPrice),
              high: Math.max(asset.dayRange.high, newPrice),
            },
            lastUpdate: Date.now(),
          };
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // Update active asset for chart if its price changed in background
  useEffect(() => {
    if (activeAssetForChart) {
      const fresh = assets.find((a) => a.id === activeAssetForChart.id);
      if (fresh && fresh.price !== activeAssetForChart.price) {
        setActiveAssetForChart(fresh);
      }
    }
  }, [assets, activeAssetForChart]);

  // Watchlist handlers
  const handleToggleWatchlist = (asset: MarketAsset) => {
    setWatchlist((prev) =>
      prev.includes(asset.symbol)
        ? prev.filter((s) => s !== asset.symbol)
        : [...prev, asset.symbol]
    );
  };

  const handleRemoveFromWatchlist = (symbol: string) => {
    setWatchlist((prev) => prev.filter((s) => s !== symbol));
  };

  const handleAddSymbolToWatchlist = (symbol: string) => {
    const found = assets.find((a) => a.symbol === symbol);
    if (found && !watchlist.includes(symbol)) {
      setWatchlist((prev) => [...prev, symbol]);
    }
  };

  const handleOpenChartForSymbol = (symbol: string) => {
    const found = assets.find((a) => a.symbol === symbol);
    if (found) {
      setActiveAssetForChart(found);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        darkMode ? 'bg-[#131722] text-[#d1d4dc]' : 'bg-[#f8f9fd] text-neutral-800'
      }`}
    >
      {/* 1. Header with strict Top Bar Contract */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleWatchlist={() => setIsWatchlistOpen(!isWatchlistOpen)}
        watchlistCount={watchlist.length}
        activeNavTab={activeSubNav}
        onSelectNavTab={(tab) => setActiveSubNav(tab as SubNavId)}
      />

      {/* 2. Top Real-Time Ticker Tape Marquee */}
      <TickerTape
        assets={assets}
        darkMode={darkMode}
        onSelectAsset={(asset) => setActiveAssetForChart(asset)}
      />

      {/* 3. Sub Navigation Bar (Overview, Indices, Stocks, Crypto, Forex, etc.) */}
      <MarketsSubNav
        activeTab={activeSubNav}
        onTabChange={(tab) => setActiveSubNav(tab)}
        darkMode={darkMode}
      />

      {/* 4. Main Body Content Viewport */}
      <main className="max-w-[1720px] mx-auto px-4 lg:px-6 pb-20">
        
        {/* OVERVIEW VIEW */}
        {activeSubNav === 'overview' && (
          <div className="space-y-6">
            {/* Major Benchmark Cards */}
            <OverviewHero
              assets={assets}
              darkMode={darkMode}
              onOpenChart={(asset) => setActiveAssetForChart(asset)}
            />

            {/* Market Movers & Table Screener */}
            <MarketsTableSection
              assets={assets}
              darkMode={darkMode}
              onSelectAsset={(asset) => setActiveAssetForChart(asset)}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              initialCategory="all"
            />

            {/* S&P 500 Heatmap Preview */}
            <MarketHeatmap
              darkMode={darkMode}
              onOpenChartForSymbol={handleOpenChartForSymbol}
            />

            {/* Technical Analysis Gauge & Economic Calendar Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TechnicalGaugeCard
                assets={assets}
                darkMode={darkMode}
                onOpenChart={(asset) => setActiveAssetForChart(asset)}
              />
              <EconomicCalendar darkMode={darkMode} />
            </div>

            {/* Curated Market News & Ideas */}
            <MarketNewsAndIdeas
              darkMode={darkMode}
              onOpenChartForSymbol={handleOpenChartForSymbol}
            />
          </div>
        )}

        {/* DEDICATED CATEGORY VIEWS (Indices, Stocks, Crypto, Forex, Futures, Bonds) */}
        {['indices', 'stocks', 'crypto', 'forex', 'futures', 'bonds'].includes(activeSubNav) && (
          <div className="space-y-6 pt-4">
            <MarketsTableSection
              assets={assets}
              darkMode={darkMode}
              onSelectAsset={(asset) => setActiveAssetForChart(asset)}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              initialCategory={activeSubNav as AssetCategory}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TechnicalGaugeCard
                assets={assets.filter((a) => a.category === activeSubNav)}
                darkMode={darkMode}
                onOpenChart={(asset) => setActiveAssetForChart(asset)}
              />
              <MarketNewsAndIdeas
                darkMode={darkMode}
                onOpenChartForSymbol={handleOpenChartForSymbol}
              />
            </div>
          </div>
        )}

        {/* DEDICATED HEATMAP VIEW */}
        {activeSubNav === 'heatmap' && (
          <div className="pt-2">
            <MarketHeatmap
              darkMode={darkMode}
              onOpenChartForSymbol={handleOpenChartForSymbol}
            />
          </div>
        )}

        {/* DEDICATED CALENDAR VIEW */}
        {activeSubNav === 'calendar' && (
          <div className="pt-2">
            <EconomicCalendar darkMode={darkMode} />
          </div>
        )}

        {/* DEDICATED NEWS & IDEAS VIEW */}
        {activeSubNav === 'news' && (
          <div className="pt-2">
            <MarketNewsAndIdeas
              darkMode={darkMode}
              onOpenChartForSymbol={handleOpenChartForSymbol}
            />
          </div>
        )}

      </main>

      {/* 5. Footer with Financial Disclaimers & Market Hours */}
      <footer
        className={`border-t py-10 transition-colors ${
          darkMode ? 'bg-[#181c27] border-[#2a2e39] text-[#787b86]' : 'bg-white border-neutral-200 text-neutral-500'
        }`}
      >
        <div className="max-w-[1720px] mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#2a2e39]/50">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded bg-[#2962ff] flex items-center justify-center text-white">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className={`text-base font-bold ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                TradingView
              </span>
              <span className="text-xs text-[#787b86]">· Global Markets Hub</span>
            </div>

            <div className="flex items-center gap-6 text-xs font-medium">
              <button onClick={() => setActiveSubNav('overview')} className="hover:text-[#2962ff]">Markets</button>
              <button onClick={() => setActiveSubNav('heatmap')} className="hover:text-[#2962ff]">Heatmaps</button>
              <button onClick={() => setActiveSubNav('calendar')} className="hover:text-[#2962ff]">Calendar</button>
              <button onClick={() => setActiveSubNav('news')} className="hover:text-[#2962ff]">Ideas & News</button>
              <a href="https://www.tradingview.com" target="_blank" rel="noreferrer" className="hover:text-[#2962ff]">Official Site</a>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
            <p className="max-w-3xl leading-relaxed">
              Market data provided for informational purposes only. Quotes are real-time or delayed per exchange regulations. Trading financial instruments carries high risk and may not be suitable for all investors.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#089981]" />
              <span>Real-Time Market Feeds Active</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 6. TradingView Supercharts Modal */}
      {activeAssetForChart && (
        <SuperChartModal
          asset={activeAssetForChart}
          onClose={() => setActiveAssetForChart(null)}
          darkMode={darkMode}
          onToggleWatchlist={handleToggleWatchlist}
          isWatchlisted={watchlist.includes(activeAssetForChart.symbol)}
        />
      )}

      {/* 7. Watchlist & Alerts Slide-over Drawer */}
      <WatchlistSidebar
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        assets={assets}
        watchlistSymbols={watchlist}
        onRemoveFromWatchlist={handleRemoveFromWatchlist}
        onAddSymbol={handleAddSymbolToWatchlist}
        onSelectAsset={(asset) => setActiveAssetForChart(asset)}
        darkMode={darkMode}
      />

      {/* 8. Global Symbol Search Modal (Cmd+K) */}
      <SymbolSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        assets={assets}
        onSelectAsset={(asset) => setActiveAssetForChart(asset)}
        darkMode={darkMode}
      />
    </div>
  );
}
