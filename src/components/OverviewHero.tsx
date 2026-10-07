import React, { useState } from 'react';
import { MarketAsset } from '../types/market';
import { Sparkline } from './Sparkline';
import { ArrowUpRight, ArrowDownRight, ExternalLink, Globe2 } from 'lucide-react';

interface OverviewHeroProps {
  assets: MarketAsset[];
  darkMode: boolean;
  onOpenChart: (asset: MarketAsset) => void;
}

export const OverviewHero: React.FC<OverviewHeroProps> = ({
  assets,
  darkMode,
  onOpenChart,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<'us' | 'world' | 'europe' | 'asia'>('us');
  const [timeframes, setTimeframes] = useState<{ [key: string]: string }>({
    spx: '1D',
    ndx: '1D',
    dji: '1D',
    btcusd: '1D',
  });

  // Filter hero assets based on region
  const heroAssets = assets.filter((a) => {
    if (selectedRegion === 'us') return ['SPX', 'NDX', 'DJI', 'BTCUSD'].includes(a.symbol);
    if (selectedRegion === 'world') return ['SPX', 'NI225', 'DAX', 'GOLD'].includes(a.symbol);
    if (selectedRegion === 'europe') return ['DAX', 'UKX', 'EURUSD'].includes(a.symbol);
    if (selectedRegion === 'asia') return ['NI225', 'USDJPY', 'GOLD'].includes(a.symbol);
    return ['SPX', 'NDX', 'DJI', 'BTCUSD'].includes(a.symbol);
  });

  const handleTimeframeChange = (assetId: string, tf: string) => {
    setTimeframes((prev) => ({ ...prev, [assetId]: tf }));
  };

  return (
    <section className="py-6 sm:py-8">
      {/* Title & Region Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            darkMode ? 'text-white' : 'text-neutral-900'
          }`}>
            Markets overview
          </h1>
          <p className={`text-xs sm:text-sm mt-1 ${
            darkMode ? 'text-[#787b86]' : 'text-neutral-500'
          }`}>
            Real-time quotes, technical indicators, and key market benchmarks across global exchanges.
          </p>
        </div>

        {/* Region Segmented Controls */}
        <div className={`flex items-center p-1 rounded-lg border self-start sm:self-auto ${
          darkMode ? 'bg-[#181c27] border-[#2a2e39]' : 'bg-neutral-100 border-neutral-200'
        }`}>
          <Globe2 className="w-3.5 h-3.5 ml-2 mr-1 text-[#787b86]" />
          {(['us', 'world', 'europe', 'asia'] as const).map((r) => {
            const labels = { us: 'United States', world: 'World', europe: 'Europe', asia: 'Asia-Pacific' };
            const isActive = selectedRegion === r;
            return (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  isActive
                    ? darkMode
                      ? 'bg-[#2a2e39] text-white shadow-xs'
                      : 'bg-white text-neutral-900 shadow-xs'
                    : darkMode
                    ? 'text-[#787b86] hover:text-[#d1d4dc]'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {labels[r]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Major Benchmark Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {heroAssets.map((asset) => {
          const isUp = asset.changePercent >= 0;
          const currentTf = timeframes[asset.id] || '1D';

          // Progress calculation for Day Range
          const dayRangeSpan = asset.dayRange.high - asset.dayRange.low || 1;
          const dayPct = Math.min(100, Math.max(0, ((asset.price - asset.dayRange.low) / dayRangeSpan) * 100));

          return (
            <div
              key={asset.id}
              className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:border-[#2962ff]/60 group ${
                darkMode
                  ? 'bg-[#181c27] border-[#2a2e39] text-[#d1d4dc]'
                  : 'bg-white border-neutral-200 text-neutral-800 shadow-xs'
              }`}
            >
              {/* Card Header: Symbol, Name & Chart launch */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-bold tracking-tight ${darkMode ? 'text-white' : 'text-neutral-950'}`}>
                        {asset.symbol}
                      </span>
                      <span className={`text-[11px] font-mono uppercase px-1.5 py-0.5 rounded ${
                        darkMode ? 'bg-[#2a2e39] text-[#787b86]' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {asset.exchange}
                      </span>
                    </div>
                    <span className={`text-xs block mt-0.5 truncate max-w-[180px] ${
                      darkMode ? 'text-[#787b86]' : 'text-neutral-500'
                    }`}>
                      {asset.name}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenChart(asset)}
                    className="p-1.5 rounded-md hover:bg-[#2962ff]/10 hover:text-[#2962ff] transition-colors text-[#787b86]"
                    title="Open in Supercharts"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                {/* Price & Change Details */}
                <div className="mt-4 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-black font-mono tracking-tight tabular-nums ${
                      darkMode ? 'text-white' : 'text-neutral-950'
                    }`}>
                      {asset.price >= 1000 ? asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : asset.price.toFixed(asset.price < 2 ? 4 : 2)}
                    </span>
                    <span className={`text-xs font-mono font-medium ${darkMode ? 'text-[#787b86]' : 'text-neutral-500'}`}>
                      {asset.currency}
                    </span>
                  </div>

                  <div className={`flex items-center gap-1 font-mono text-xs font-bold tabular-nums ${
                    isUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}>
                    {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    <span>{isUp ? `+${asset.change.toFixed(2)}` : asset.change.toFixed(2)}</span>
                    <span>({isUp ? `+${asset.changePercent.toFixed(2)}%` : `${asset.changePercent.toFixed(2)}%`})</span>
                  </div>
                </div>

                {/* Interactive Chart Preview */}
                <div className="mt-4 mb-2 cursor-pointer" onClick={() => onOpenChart(asset)}>
                  <Sparkline
                    data={asset.sparkline}
                    width={280}
                    height={74}
                    isPositive={isUp}
                    strokeWidth={2}
                    showGradient={true}
                    className="w-full h-[74px]"
                  />
                </div>

                {/* Timeframe switchers */}
                <div className="flex items-center justify-between border-t border-b py-2 my-3 text-[11px] font-semibold">
                  {['1D', '5D', '1M', '6M', '1Y', 'ALL'].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => handleTimeframeChange(asset.id, tf)}
                      className={`px-1.5 py-0.5 rounded transition-colors ${
                        currentTf === tf
                          ? 'bg-[#2962ff] text-white'
                          : darkMode
                          ? 'text-[#787b86] hover:text-[#d1d4dc]'
                          : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day's Range and Key Stats */}
              <div className="space-y-3 pt-1">
                {/* Day Range Bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#787b86] mb-1">
                    <span>L: {asset.dayRange.low.toLocaleString()}</span>
                    <span className="font-sans text-[10px] uppercase">Day's Range</span>
                    <span>H: {asset.dayRange.high.toLocaleString()}</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-[#2a2e39]' : 'bg-neutral-200'}`}>
                    <div
                      className={`h-full rounded-full ${isUp ? 'bg-[#089981]' : 'bg-[#f23645]'}`}
                      style={{ width: `${dayPct}%` }}
                    />
                  </div>
                </div>

                {/* Technical Rating pill */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#787b86]">Technical Rating</span>
                  <span
                    className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${
                      asset.technicalRating.includes('Buy')
                        ? 'bg-[#089981]/15 text-[#089981]'
                        : asset.technicalRating.includes('Sell')
                        ? 'bg-[#f23645]/15 text-[#f23645]'
                        : 'bg-amber-500/15 text-amber-500'
                    }`}
                  >
                    {asset.technicalRating}
                  </span>
                </div>

                {/* Launch Chart CTA button */}
                <button
                  onClick={() => onOpenChart(asset)}
                  className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    darkMode
                      ? 'border-[#2a2e39] bg-[#1e222d] text-white hover:bg-[#2962ff] hover:border-[#2962ff]'
                      : 'border-neutral-200 bg-neutral-100 text-neutral-800 hover:bg-[#2962ff] hover:text-white hover:border-[#2962ff]'
                  }`}
                >
                  <span>Open interactive chart</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
