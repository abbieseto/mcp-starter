import React, { useState, useEffect, useRef } from 'react';
import { MarketAsset, AssetCategory } from '../types/market';
import { Search, X, TrendingUp, ArrowRight } from 'lucide-react';

interface SymbolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  darkMode: boolean;
}

export const SymbolSearchModal: React.FC<SymbolSearchModalProps> = ({
  isOpen,
  onClose,
  assets,
  onSelectAsset,
  darkMode,
}) => {
  const [query, setQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<AssetCategory | 'all'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = assets.filter((a) => {
    const matchesCat = categoryFilter === 'all' || a.category === categoryFilter;
    const matchesQuery =
      !query.trim() ||
      a.symbol.toLowerCase().includes(query.toLowerCase()) ||
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.exchange.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col transition-colors ${
          darkMode ? 'bg-[#181c27] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-neutral-300 text-neutral-800'
        }`}
      >
        {/* Search Input Bar */}
        <div className={`p-4 border-b flex items-center gap-3 ${
          darkMode ? 'border-[#2a2e39]' : 'border-neutral-200'
        }`}>
          <Search className="w-5 h-5 text-[#2962ff] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by symbol, company, or market..."
            className={`w-full bg-transparent text-sm sm:text-base outline-none font-sans ${
              darkMode ? 'text-white placeholder-[#787b86]' : 'text-neutral-900 placeholder-neutral-400'
            }`}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-[#787b86] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className={`px-2 py-1 rounded text-xs font-mono ${
              darkMode ? 'bg-[#2a2e39] text-[#787b86]' : 'bg-neutral-100 text-neutral-500'
            }`}
          >
            ESC
          </button>
        </div>

        {/* Category Pills */}
        <div className={`px-4 py-2 border-b flex items-center gap-1.5 overflow-x-auto no-scrollbar ${
          darkMode ? 'bg-[#131722] border-[#2a2e39]' : 'bg-neutral-50 border-neutral-200'
        }`}>
          {(['all', 'indices', 'stocks', 'crypto', 'forex', 'futures', 'bonds'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#2962ff] text-white'
                  : darkMode
                  ? 'text-[#787b86] hover:text-[#d1d4dc]'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[#2a2e39]/50">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#787b86]">
              No instruments found for "{query}"
            </div>
          ) : (
            filtered.map((asset) => {
              const isUp = asset.changePercent >= 0;
              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  className={`p-3.5 px-4 flex items-center justify-between cursor-pointer transition-colors ${
                    darkMode ? 'hover:bg-[#1e222d]' : 'hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center ${
                      darkMode ? 'bg-[#2a2e39] text-white' : 'bg-neutral-100 text-neutral-900'
                    }`}>
                      {asset.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                          {asset.symbol}
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded uppercase ${
                          darkMode ? 'bg-[#2a2e39] text-[#787b86]' : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          {asset.exchange}
                        </span>
                        <span className="text-[10px] text-[#787b86] capitalize">
                          {asset.category}
                        </span>
                      </div>
                      <span className={`text-xs block ${darkMode ? 'text-[#787b86]' : 'text-neutral-500'}`}>
                        {asset.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono text-xs font-bold tabular-nums">
                        {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {asset.currency}
                      </div>
                      <div className={`font-mono text-[11px] font-bold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}>
                        {isUp ? `+${asset.changePercent.toFixed(2)}%` : `${asset.changePercent.toFixed(2)}%`}
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-[#787b86]" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className={`p-3 border-t text-[11px] text-[#787b86] flex items-center justify-between ${
          darkMode ? 'bg-[#131722] border-[#2a2e39]' : 'bg-neutral-50 border-neutral-200'
        }`}>
          <span>Select any symbol to inspect real-time chart and indicators</span>
          <span>TradingView Markets Hub</span>
        </div>
      </div>
    </div>
  );
};
