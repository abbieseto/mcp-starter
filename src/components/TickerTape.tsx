import React, { useRef } from 'react';
import { MarketAsset } from '../types/market';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Sparkline } from './Sparkline';

interface TickerTapeProps {
  assets: MarketAsset[];
  darkMode: boolean;
  onSelectAsset: (asset: MarketAsset) => void;
}

export const TickerTape: React.FC<TickerTapeProps> = ({
  assets,
  darkMode,
  onSelectAsset,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Take a diverse mix of key indices, stocks, crypto, commodities, forex
  const tickerItems = assets.slice(0, 12);

  return (
    <div
      className={`w-full overflow-hidden border-b select-none transition-colors ${
        darkMode ? 'bg-[#181c27] border-[#2a2e39]' : 'bg-neutral-50 border-neutral-200'
      }`}
    >
      <div
        ref={containerRef}
        className="flex items-center overflow-x-auto no-scrollbar py-1.5 px-3 gap-3 md:gap-4 scroll-smooth"
      >
        {tickerItems.map((asset) => {
          const isUp = asset.changePercent >= 0;
          return (
            <button
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className={`flex items-center gap-3 px-3 py-1 rounded-md shrink-0 text-left transition-all ${
                darkMode
                  ? 'hover:bg-[#202533] text-[#d1d4dc]'
                  : 'hover:bg-white hover:shadow-xs text-neutral-800'
              }`}
            >
              {/* Symbol & Exchange */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs tracking-tight">{asset.symbol}</span>
                  <span className={`text-[10px] uppercase font-mono ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {asset.exchange}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-xs font-semibold tabular-nums">
                    {asset.price >= 1000 ? asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : asset.price.toFixed(asset.price < 2 ? 4 : 2)}
                  </span>
                </div>
              </div>

              {/* Sparkline */}
              <div className="hidden sm:block">
                <Sparkline
                  data={asset.sparkline}
                  width={52}
                  height={20}
                  isPositive={isUp}
                  strokeWidth={1.5}
                />
              </div>

              {/* % Change Pill */}
              <div
                className={`flex items-center text-[11px] font-mono font-medium tabular-nums ${
                  isUp ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isUp ? (
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                )}
                <span>{isUp ? `+${asset.changePercent.toFixed(2)}%` : `${asset.changePercent.toFixed(2)}%`}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
