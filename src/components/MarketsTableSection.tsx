import React, { useState, useMemo } from 'react';
import { MarketAsset, AssetCategory } from '../types/market';
import { Sparkline } from './Sparkline';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Star,
  Search,
  ExternalLink,
  SlidersHorizontal,
  Flame,
  TrendingUp,
  TrendingDown,
  Award
} from 'lucide-react';

interface MarketsTableSectionProps {
  assets: MarketAsset[];
  darkMode: boolean;
  onSelectAsset: (asset: MarketAsset) => void;
  watchlist: string[];
  onToggleWatchlist: (asset: MarketAsset) => void;
  initialCategory?: AssetCategory | 'all';
}

export const MarketsTableSection: React.FC<MarketsTableSectionProps> = ({
  assets,
  darkMode,
  onSelectAsset,
  watchlist,
  onToggleWatchlist,
  initialCategory = 'all',
}) => {
  const [filterMode, setFilterMode] = useState<'active' | 'gainers' | 'losers' | 'large_cap' | 'all'>('active');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<'price' | 'changePercent' | 'volumeNumeric' | 'symbol'>('volumeNumeric');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter & sort logic
  const filteredAssets = useMemo(() => {
    let result = [...assets];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((a) => a.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.symbol.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.exchange.toLowerCase().includes(q)
      );
    }

    // Table Mode filter
    if (filterMode === 'gainers') {
      result = result.filter((a) => a.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent);
    } else if (filterMode === 'losers') {
      result = result.filter((a) => a.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent);
    } else if (filterMode === 'active') {
      result = result.sort((a, b) => b.volumeNumeric - a.volumeNumeric);
    } else if (filterMode === 'large_cap') {
      result = result.sort((a, b) => (b.marketCapNumeric || 0) - (a.marketCapNumeric || 0));
    }

    // Sort column override
    if (sortField) {
      result.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') valA = (valA as string).toLowerCase();
        if (typeof valB === 'string') valB = (valB as string).toLowerCase();

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [assets, selectedCategory, searchQuery, filterMode, sortField, sortOrder]);

  const handleSort = (field: 'price' | 'changePercent' | 'volumeNumeric' | 'symbol') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="py-6 space-y-4">
      {/* Table Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
            Market Movers & Screeners
          </h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? 'text-[#787b86]' : 'text-neutral-500'}`}>
            Discover top active stocks, breakout performers, cryptocurrencies, and global macro contracts.
          </p>
        </div>

        {/* Filter Presets: Most Active / Gainers / Losers / Large Cap */}
        <div className={`flex items-center p-1 rounded-lg border self-start md:self-auto overflow-x-auto no-scrollbar ${
          darkMode ? 'bg-[#181c27] border-[#2a2e39]' : 'bg-neutral-100 border-neutral-200'
        }`}>
          {[
            { id: 'active', label: 'Most Active', icon: <Flame className="w-3.5 h-3.5 text-amber-500" /> },
            { id: 'gainers', label: 'Top Gainers', icon: <TrendingUp className="w-3.5 h-3.5 text-[#089981]" /> },
            { id: 'losers', label: 'Top Losers', icon: <TrendingDown className="w-3.5 h-3.5 text-[#f23645]" /> },
            { id: 'large_cap', label: 'Large Cap', icon: <Award className="w-3.5 h-3.5 text-[#2962ff]" /> },
            { id: 'all', label: 'All', icon: <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" /> },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setFilterMode(mode.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                filterMode === mode.id
                  ? darkMode
                    ? 'bg-[#2a2e39] text-white shadow-xs'
                    : 'bg-white text-neutral-900 shadow-xs'
                  : darkMode
                  ? 'text-[#787b86] hover:text-[#d1d4dc]'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {mode.icon}
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs & In-Table Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['all', 'indices', 'stocks', 'crypto', 'forex', 'futures', 'bonds'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#2962ff] text-white'
                  : darkMode
                  ? 'bg-[#1e222d] text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#252a37]'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
              }`}
            >
              {cat === 'all' ? 'All Markets' : cat}
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#787b86]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter symbols or names..."
            className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border outline-none font-sans transition-colors ${
              darkMode
                ? 'bg-[#181c27] border-[#2a2e39] text-white placeholder-[#787b86] focus:border-[#2962ff]'
                : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-[#2962ff]'
            }`}
          />
        </div>
      </div>

      {/* Main High-Density Table */}
      <div
        className={`rounded-2xl border overflow-hidden transition-colors ${
          darkMode ? 'bg-[#131722] border-[#2a2e39]' : 'bg-white border-neutral-200 shadow-xs'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr
                className={`border-b text-[11px] font-semibold uppercase tracking-wider select-none ${
                  darkMode ? 'bg-[#181c27] border-[#2a2e39] text-[#787b86]' : 'bg-neutral-50 border-neutral-200 text-neutral-500'
                }`}
              >
                <th className="py-3 px-3 w-10 text-center">★</th>
                
                <th
                  className="py-3 px-3 cursor-pointer hover:text-blue-500"
                  onClick={() => handleSort('symbol')}
                >
                  <div className="flex items-center gap-1">
                    <span>Symbol / Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                <th
                  className="py-3 px-3 text-right cursor-pointer hover:text-blue-500"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                <th
                  className="py-3 px-3 text-right cursor-pointer hover:text-blue-500"
                  onClick={() => handleSort('changePercent')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Change %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                <th className="py-3 px-3 text-center">Technical Rating</th>
                <th className="py-3 px-3 text-right">Day High / Low</th>

                <th
                  className="py-3 px-3 text-right cursor-pointer hover:text-blue-500"
                  onClick={() => handleSort('volumeNumeric')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Volume</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                <th className="py-3 px-3 text-right">Market Cap</th>
                <th className="py-3 px-4 text-center">24h Trend</th>
                <th className="py-3 px-3 text-center">Chart</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200 dark:divide-[#2a2e39]/60">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[#787b86]">
                    No market assets found matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const isUp = asset.changePercent >= 0;
                  const isStarred = watchlist.includes(asset.symbol);

                  return (
                    <tr
                      key={asset.id}
                      onClick={() => onSelectAsset(asset)}
                      className={`cursor-pointer transition-colors ${
                        darkMode
                          ? 'hover:bg-[#1e222d] text-[#d1d4dc]'
                          : 'hover:bg-neutral-50 text-neutral-800'
                      }`}
                    >
                      {/* Star Watchlist Toggle */}
                      <td
                        className="py-3 px-3 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(asset);
                        }}
                      >
                        <button
                          className={`p-1 rounded transition-colors ${
                            isStarred ? 'text-amber-400 fill-amber-400' : 'text-[#787b86] hover:text-amber-400'
                          }`}
                          title={isStarred ? 'Remove from watchlist' : 'Add to watchlist'}
                        >
                          <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400' : ''}`} />
                        </button>
                      </td>

                      {/* Symbol & Name */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-md font-bold text-xs flex items-center justify-center shrink-0 ${
                            darkMode ? 'bg-[#2a2e39] text-white' : 'bg-neutral-100 text-neutral-800'
                          }`}>
                            {asset.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className={`font-bold font-sans ${darkMode ? 'text-white' : 'text-neutral-950'}`}>
                                {asset.symbol}
                              </span>
                              <span className={`text-[10px] font-mono uppercase px-1 py-0.2 rounded ${
                                darkMode ? 'bg-[#2a2e39] text-[#787b86]' : 'bg-neutral-200 text-neutral-600'
                              }`}>
                                {asset.exchange}
                              </span>
                            </div>
                            <span className={`text-[11px] block truncate max-w-[170px] ${
                              darkMode ? 'text-[#787b86]' : 'text-neutral-500'
                            }`}>
                              {asset.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Price (Tabular nums) */}
                      <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                        <span className={darkMode ? 'text-white' : 'text-neutral-900'}>
                          {asset.price >= 1000
                            ? asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : asset.price.toFixed(asset.price < 2 ? 4 : 2)}
                        </span>
                      </td>

                      {/* Change % and $ */}
                      <td className="py-3 px-3 text-right font-mono tabular-nums">
                        <div className={`flex items-center justify-end font-bold ${
                          isUp ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}>
                          {isUp ? <ArrowUp className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDown className="w-3.5 h-3.5 mr-0.5" />}
                          <span>{isUp ? `+${asset.changePercent.toFixed(2)}%` : `${asset.changePercent.toFixed(2)}%`}</span>
                        </div>
                        <div className={`text-[10px] ${isUp ? 'text-[#089981]/80' : 'text-[#f23645]/80'}`}>
                          {isUp ? `+${asset.change.toFixed(2)}` : asset.change.toFixed(2)}
                        </div>
                      </td>

                      {/* Technical Rating */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                            asset.technicalRating.includes('Buy')
                              ? 'bg-[#089981]/15 text-[#089981]'
                              : asset.technicalRating.includes('Sell')
                              ? 'bg-[#f23645]/15 text-[#f23645]'
                              : 'bg-amber-500/15 text-amber-500'
                          }`}
                        >
                          {asset.technicalRating}
                        </span>
                      </td>

                      {/* High / Low */}
                      <td className="py-3 px-3 text-right font-mono text-[11px] tabular-nums text-[#787b86]">
                        <div>H: {asset.dayRange.high.toLocaleString()}</div>
                        <div>L: {asset.dayRange.low.toLocaleString()}</div>
                      </td>

                      {/* Volume */}
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-[#787b86]">
                        {asset.volume}
                      </td>

                      {/* Market Cap */}
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-[#787b86]">
                        {asset.marketCap || '—'}
                      </td>

                      {/* Mini Sparkline */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-block">
                          <Sparkline
                            data={asset.sparkline}
                            width={80}
                            height={24}
                            isPositive={isUp}
                            strokeWidth={1.5}
                          />
                        </div>
                      </td>

                      {/* Launch Chart Action */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAsset(asset);
                          }}
                          className={`p-1.5 rounded-md transition-colors ${
                            darkMode
                              ? 'hover:bg-[#2962ff] hover:text-white text-[#787b86]'
                              : 'hover:bg-[#2962ff] hover:text-white text-neutral-500'
                          }`}
                          title="Open Superchart"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
