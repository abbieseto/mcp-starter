import React, { useState } from 'react';
import { HEATMAP_SECTORS } from '../data/marketData';
import { MarketAsset } from '../types/market';
import { Filter, Clock, ExternalLink } from 'lucide-react';

interface MarketHeatmapProps {
  darkMode: boolean;
  onOpenChartForSymbol: (symbol: string) => void;
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({
  darkMode,
  onOpenChartForSymbol,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const [hoveredItem, setHoveredItem] = useState<{
    symbol: string;
    name: string;
    price: number;
    changePercent: number;
    marketCap: string;
    pe?: number;
    sector: string;
  } | null>(null);

  const filteredSectors = selectedSector === 'all'
    ? HEATMAP_SECTORS
    : HEATMAP_SECTORS.filter((s) => s.name.toLowerCase() === selectedSector.toLowerCase());

  // Helper for color calculation
  const getPerformanceColor = (change: number) => {
    // Multipliers for timeframe visualization
    const multiplier = timeframe === '1D' ? 1 : timeframe === '1W' ? 2 : 3.5;
    const adjusted = change * (timeframe === '1D' ? 1 : timeframe === '1W' ? 1.4 : 2);

    if (adjusted >= 3) return '#089981'; // Vibrant emerald green
    if (adjusted >= 1.5) return '#0e7a68';
    if (adjusted > 0.3) return '#145c50';
    if (adjusted >= -0.3) return darkMode ? '#2a2e39' : '#9ca3af'; // Neutral
    if (adjusted > -1.5) return '#8c242e';
    if (adjusted > -3) return '#b82b36';
    return '#f23645'; // Vibrant red
  };

  return (
    <div className="py-6 space-y-6">
      {/* Heatmap Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
            S&P 500 Stock Market Heatmap
          </h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? 'text-[#787b86]' : 'text-neutral-500'}`}>
            Treemap visualization of the S&P 500 index. Tile area is proportional to market capitalization, color indicates performance.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sector selector */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#787b86]" />
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                darkMode
                  ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-800'
              }`}
            >
              <option value="all">All Sectors</option>
              {HEATMAP_SECTORS.map((s) => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Timeframe switch */}
          <div className={`flex items-center p-0.5 rounded-lg border ${
            darkMode ? 'bg-[#181c27] border-[#2a2e39]' : 'bg-neutral-100 border-neutral-300'
          }`}>
            <Clock className="w-3 h-3 ml-2 mr-1 text-[#787b86]" />
            {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  timeframe === tf
                    ? 'bg-[#2962ff] text-white shadow-xs'
                    : darkMode
                    ? 'text-[#787b86] hover:text-[#d1d4dc]'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Treemap Layout Container */}
      <div
        className={`rounded-2xl border p-4 sm:p-6 transition-colors ${
          darkMode ? 'bg-[#131722] border-[#2a2e39]' : 'bg-white border-neutral-200 shadow-sm'
        }`}
      >
        {/* Heatmap Legend Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2a2e39]/50 text-xs mb-4">
          <span className="font-semibold text-xs text-[#787b86]">Market Performance Legend</span>
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <span className="text-[#f23645] font-bold">-3%</span>
            <div className="flex h-3 w-36 rounded overflow-hidden">
              <span className="flex-1 bg-[#f23645]" />
              <span className="flex-1 bg-[#b82b36]" />
              <span className="flex-1 bg-[#8c242e]" />
              <span className="flex-1 bg-[#2a2e39]" />
              <span className="flex-1 bg-[#145c50]" />
              <span className="flex-1 bg-[#0e7a68]" />
              <span className="flex-1 bg-[#089981]" />
            </div>
            <span className="text-[#089981] font-bold">+3%</span>
          </div>
        </div>

        {/* Dynamic Sector Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSectors.map((sector) => (
            <div
              key={sector.name}
              className={`rounded-xl p-3 border flex flex-col justify-between ${
                darkMode ? 'bg-[#181c27] border-[#2a2e39]' : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              {/* Sector Title & Total Weight */}
              <div className="flex items-center justify-between mb-2.5 px-1">
                <span className={`text-xs font-bold tracking-tight ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                  {sector.name}
                </span>
                <span className="text-[10px] font-mono text-[#787b86]">
                  Weight {sector.weight}%
                </span>
              </div>

              {/* Tiles in Sector */}
              <div className="grid grid-cols-3 gap-1.5 flex-1 min-h-[170px]">
                {sector.items.map((item, idx) => {
                  const tileBg = getPerformanceColor(item.changePercent);
                  // Top cap stocks occupy larger tile (2 columns)
                  const isLarge = idx === 0 && sector.items.length > 2;

                  return (
                    <button
                      key={item.symbol}
                      onClick={() => onOpenChartForSymbol(item.symbol)}
                      onMouseEnter={() => setHoveredItem({ ...item, sector: sector.name })}
                      onMouseLeave={() => setHoveredItem(null)}
                      style={{ backgroundColor: tileBg }}
                      className={`rounded-lg p-2 flex flex-col justify-between text-left text-white transition-all transform hover:scale-[1.02] hover:z-10 hover:shadow-lg focus:outline-none ${
                        isLarge ? 'col-span-2 row-span-2 min-h-[120px]' : 'col-span-1 min-h-[60px]'
                      }`}
                    >
                      <div className="flex items-start justify-between w-full">
                        <span className="font-extrabold font-sans text-xs tracking-tight">
                          {item.symbol}
                        </span>
                        {isLarge && (
                          <span className="text-[10px] opacity-80 font-mono">
                            {item.marketCap}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto">
                        <div className="font-mono font-bold text-xs tabular-nums">
                          {item.changePercent >= 0 ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                        </div>
                        {isLarge && (
                          <div className="text-[10px] opacity-85 font-mono truncate">
                            ${item.price.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Hover Inspector Card */}
        {hoveredItem && (
          <div
            className={`mt-4 p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in duration-150 ${
              darkMode ? 'bg-[#181c27] border-[#2a2e39] text-[#d1d4dc]' : 'bg-neutral-100 border-neutral-300 text-neutral-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#2962ff] text-white font-black text-sm flex items-center justify-center">
                {hoveredItem.symbol.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{hoveredItem.symbol}</span>
                  <span className="text-[#787b86]">·</span>
                  <span className="font-medium">{hoveredItem.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-neutral-800 text-[#787b86]">
                    {hoveredItem.sector}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs mt-0.5">
                  <span>Price: <strong>${hoveredItem.price.toFixed(2)}</strong></span>
                  <span className={hoveredItem.changePercent >= 0 ? 'text-[#089981] font-bold' : 'text-[#f23645] font-bold'}>
                    Change: {hoveredItem.changePercent >= 0 ? `+${hoveredItem.changePercent.toFixed(2)}%` : `${hoveredItem.changePercent.toFixed(2)}%`}
                  </span>
                  <span>Market Cap: <strong>{hoveredItem.marketCap}</strong></span>
                  {hoveredItem.pe && <span>P/E: <strong>{hoveredItem.pe}</strong></span>}
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenChartForSymbol(hoveredItem.symbol)}
              className="px-3 py-1.5 rounded-lg bg-[#2962ff] text-white hover:bg-[#1e53e5] font-semibold text-xs flex items-center gap-1.5 self-end sm:self-auto shrink-0 transition-colors"
            >
              <span>View Chart</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
