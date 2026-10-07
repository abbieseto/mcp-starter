import React, { useState } from 'react';
import { MarketAsset } from '../types/market';
import { Sparkline } from './Sparkline';
import { X, Plus, Trash2, Bell, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';

interface WatchlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  assets: MarketAsset[];
  watchlistSymbols: string[];
  onRemoveFromWatchlist: (symbol: string) => void;
  onAddSymbol: (symbol: string) => void;
  onSelectAsset: (asset: MarketAsset) => void;
  darkMode: boolean;
}

export const WatchlistSidebar: React.FC<WatchlistSidebarProps> = ({
  isOpen,
  onClose,
  assets,
  watchlistSymbols,
  onRemoveFromWatchlist,
  onAddSymbol,
  onSelectAsset,
  darkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'alerts'>('watchlist');
  const [newSymbolInput, setNewSymbolInput] = useState<string>('');
  const [alerts, setAlerts] = useState<{ id: string; symbol: string; target: number; condition: 'Above' | 'Below' }[]>([
    { id: '1', symbol: 'BTCUSD', target: 65000, condition: 'Above' },
    { id: '2', symbol: 'SPX', target: 5800, condition: 'Above' },
  ]);
  const [newAlertSymbol, setNewAlertSymbol] = useState<string>('SPX');
  const [newAlertTarget, setNewAlertTarget] = useState<string>('5800');
  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const watchlistAssets = assets.filter((a) => watchlistSymbols.includes(a.symbol));

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSymbolInput.trim()) {
      onAddSymbol(newSymbolInput.trim().toUpperCase());
      setNewSymbolInput('');
    }
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertTarget) return;
    setAlerts((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        symbol: newAlertSymbol,
        target: parseFloat(newAlertTarget),
        condition: 'Above',
      },
    ]);
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 2500);
  };

  return (
    <aside
      className={`fixed top-14 right-0 bottom-0 w-80 sm:w-96 z-40 border-l flex flex-col shadow-2xl transition-all duration-200 animate-in slide-in-from-right-4 ${
        darkMode ? 'bg-[#131722] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-neutral-200 text-neutral-800'
      }`}
    >
      {/* Header with Tabs & Close */}
      <div className={`p-3.5 border-b flex items-center justify-between shrink-0 ${
        darkMode ? 'bg-[#181c27] border-[#2a2e39]' : 'bg-neutral-50 border-neutral-200'
      }`}>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
              activeTab === 'watchlist'
                ? 'bg-[#2962ff] text-white'
                : darkMode ? 'text-[#787b86] hover:text-[#d1d4dc]' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Watchlist ({watchlistSymbols.length})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-colors flex items-center gap-1 ${
              activeTab === 'alerts'
                ? 'bg-[#2962ff] text-white'
                : darkMode ? 'text-[#787b86] hover:text-[#d1d4dc]' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alerts ({alerts.length})</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-neutral-800 text-[#787b86] hover:text-white transition-colors"
          title="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* WATCHLIST TAB */}
      {activeTab === 'watchlist' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Add Symbol Input */}
          <form onSubmit={handleAddSubmit} className="p-3 border-b border-[#2a2e39]/50">
            <div className="relative">
              <input
                type="text"
                placeholder="Add symbol (e.g. AAPL, NVDA)..."
                value={newSymbolInput}
                onChange={(e) => setNewSymbolInput(e.target.value)}
                className={`w-full px-3 py-1.5 pr-8 text-xs rounded-lg border outline-none font-sans uppercase ${
                  darkMode
                    ? 'bg-[#181c27] border-[#2a2e39] text-white focus:border-[#2962ff]'
                    : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-[#2962ff]'
                }`}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#2962ff] hover:text-blue-400"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* List of Watchlist Assets */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#2a2e39]/40">
            {watchlistAssets.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#787b86]">
                <p>Your watchlist is empty.</p>
                <p className="mt-1">Star assets from the overview or table to monitor them here.</p>
              </div>
            ) : (
              watchlistAssets.map((asset) => {
                const isUp = asset.changePercent >= 0;
                return (
                  <div
                    key={asset.id}
                    onClick={() => onSelectAsset(asset)}
                    className={`p-3 flex items-center justify-between cursor-pointer transition-colors group ${
                      darkMode ? 'hover:bg-[#181c27]' : 'hover:bg-neutral-50'
                    }`}
                  >
                    {/* Left: Symbol & Exchange */}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs">{asset.symbol}</span>
                        <span className="text-[10px] font-mono text-[#787b86] uppercase">
                          {asset.exchange}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#787b86] block truncate max-w-[110px]">
                        {asset.name}
                      </span>
                    </div>

                    {/* Center: Sparkline */}
                    <div className="hidden sm:block">
                      <Sparkline
                        data={asset.sparkline}
                        width={48}
                        height={20}
                        isPositive={isUp}
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Right: Price & % Change + Trash */}
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="font-mono text-xs font-bold tabular-nums">
                          {asset.price >= 1000 ? asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : asset.price.toFixed(asset.price < 2 ? 4 : 2)}
                        </div>
                        <div className={`font-mono text-[10px] font-bold tabular-nums ${
                          isUp ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}>
                          {isUp ? `+${asset.changePercent.toFixed(2)}%` : `${asset.changePercent.toFixed(2)}%`}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFromWatchlist(asset.symbol);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#787b86] hover:text-[#f23645] transition-opacity"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ALERTS TAB */}
      {activeTab === 'alerts' && (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
          {/* New Alert Form */}
          <form onSubmit={handleCreateAlert} className={`p-3.5 rounded-xl border ${darkMode ? 'bg-[#181c27] border-[#2a2e39]' : 'bg-neutral-50 border-neutral-200'}`}>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-[#787b86]">
              Set Price Alert
            </h4>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] text-[#787b86] block mb-1">Asset</label>
                <select
                  value={newAlertSymbol}
                  onChange={(e) => setNewAlertSymbol(e.target.value)}
                  className={`w-full text-xs font-semibold p-1.5 rounded-lg border ${
                    darkMode ? 'bg-[#131722] border-[#2a2e39] text-white' : 'bg-white border-neutral-300'
                  }`}
                >
                  {assets.slice(0, 10).map((a) => (
                    <option key={a.symbol} value={a.symbol}>{a.symbol} - {a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#787b86] block mb-1">Trigger Price ($)</label>
                <input
                  type="number"
                  step="any"
                  value={newAlertTarget}
                  onChange={(e) => setNewAlertTarget(e.target.value)}
                  className={`w-full text-xs font-mono p-1.5 rounded-lg border ${
                    darkMode ? 'bg-[#131722] border-[#2a2e39] text-white' : 'bg-white border-neutral-300'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-1.5 rounded-lg bg-[#2962ff] text-white font-semibold text-xs hover:bg-[#1e53e5] transition-colors mt-2"
              >
                Create Alert
              </button>

              {alertSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-[#089981] font-semibold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Alert created successfully!</span>
                </div>
              )}
            </div>
          </form>

          {/* Active Alerts List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-[#787b86]">
              Active Triggers ({alerts.length})
            </h4>

            <div className="space-y-2">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                    darkMode ? 'bg-[#181c27] border-[#2a2e39]' : 'bg-white border-neutral-200'
                  }`}
                >
                  <div>
                    <div className="font-bold font-sans text-sm">{al.symbol}</div>
                    <div className="text-[11px] text-[#787b86]">
                      Condition: {al.condition} ${al.target.toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => setAlerts((prev) => prev.filter((x) => x.id !== al.id))}
                    className="p-1 text-[#787b86] hover:text-[#f23645] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
