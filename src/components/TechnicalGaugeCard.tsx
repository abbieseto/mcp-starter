import React, { useState } from 'react';
import { MarketAsset } from '../types/market';
import { Compass, Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface TechnicalGaugeCardProps {
  assets: MarketAsset[];
  darkMode: boolean;
  onOpenChart: (asset: MarketAsset) => void;
}

export const TechnicalGaugeCard: React.FC<TechnicalGaugeCardProps> = ({
  assets,
  darkMode,
  onOpenChart,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('SPX');
  const [gaugeTimeframe, setGaugeTimeframe] = useState<string>('1D');

  const asset = assets.find((a) => a.symbol === selectedSymbol) || assets[0];

  // Calculate needle angle based on buy/neutral/sell scores
  // Scale from -90 deg (Strong Sell) to +90 deg (Strong Buy)
  const total = asset.ratingScores.buy + asset.ratingScores.neutral + asset.ratingScores.sell || 26;
  const netScore = (asset.ratingScores.buy - asset.ratingScores.sell) / total; // -1 to +1
  const needleAngle = Math.max(-80, Math.min(80, netScore * 85));

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 transition-colors ${
        darkMode ? 'bg-[#181c27] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-neutral-200 shadow-xs text-neutral-800'
      }`}
    >
      {/* Header with Asset Switcher & Timeframe */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#2962ff]" />
            <h3 className={`text-base font-bold tracking-tight ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
              Technical Analysis Summary
            </h3>
          </div>
          <p className="text-xs text-[#787b86] mt-0.5">
            Real-time multi-indicator consensus based on moving averages and momentum oscillators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Symbol selector */}
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              darkMode
                ? 'bg-[#1e222d] border-[#2a2e39] text-white'
                : 'bg-neutral-100 border-neutral-300 text-neutral-800'
            }`}
          >
            {assets.slice(0, 10).map((a) => (
              <option key={a.symbol} value={a.symbol}>
                {a.symbol} ({a.name})
              </option>
            ))}
          </select>

          {/* Timeframe pill */}
          <div className={`flex items-center p-0.5 rounded-lg border ${
            darkMode ? 'bg-[#131722] border-[#2a2e39]' : 'bg-neutral-100 border-neutral-300'
          }`}>
            {['1h', '4h', '1D', '1W'].map((tf) => (
              <button
                key={tf}
                onClick={() => setGaugeTimeframe(tf)}
                className={`px-2 py-0.5 text-xs font-semibold rounded ${
                  gaugeTimeframe === tf
                    ? 'bg-[#2962ff] text-white'
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

      {/* Main Speedometer Arc */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative w-72 h-36 flex items-end justify-center overflow-hidden">
          {/* SVG Arc Gauge */}
          <svg className="w-72 h-72 -mb-36" viewBox="0 0 200 200">
            {/* Background Track Arcs */}
            {/* Strong Sell (Red) */}
            <path
              d="M 20 100 A 80 80 0 0 1 45 45"
              fill="none"
              stroke="#f23645"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Sell (Light Red) */}
            <path
              d="M 50 40 A 80 80 0 0 1 80 23"
              fill="none"
              stroke="#ff707e"
              strokeWidth="14"
            />
            {/* Neutral (Gray) */}
            <path
              d="M 85 22 A 80 80 0 0 1 115 22"
              fill="none"
              stroke={darkMode ? '#434651' : '#cbd5e1'}
              strokeWidth="14"
            />
            {/* Buy (Light Green) */}
            <path
              d="M 120 23 A 80 80 0 0 1 150 40"
              fill="none"
              stroke="#26c29e"
              strokeWidth="14"
            />
            {/* Strong Buy (Vibrant Green) */}
            <path
              d="M 155 45 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#089981"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Pivot Center Point */}
            <circle cx="100" cy="100" r="7" fill={darkMode ? '#ffffff' : '#1e293b'} />
          </svg>

          {/* Animated Needle */}
          <div
            className="absolute bottom-0 w-1.5 h-28 origin-bottom rounded-full transition-transform duration-700 ease-out shadow-md"
            style={{
              transform: `rotate(${needleAngle}deg)`,
              backgroundColor: darkMode ? '#ffffff' : '#0f172a',
            }}
          >
            <div className="w-3 h-3 -mt-1.5 -ml-0.5 rounded-full bg-[#2962ff]" />
          </div>
        </div>

        {/* Status text */}
        <div className="mt-4 text-center">
          <span
            className={`text-lg font-black font-sans uppercase tracking-wide px-3 py-1 rounded-md ${
              asset.technicalRating.includes('Buy')
                ? 'bg-[#089981]/15 text-[#089981]'
                : asset.technicalRating.includes('Sell')
                ? 'bg-[#f23645]/15 text-[#f23645]'
                : 'bg-amber-500/15 text-amber-500'
            }`}
          >
            {asset.technicalRating}
          </span>
          <div className="flex items-center justify-center gap-4 text-xs font-mono mt-2 text-[#787b86]">
            <span>Sell: <strong className="text-[#f23645]">{asset.ratingScores.sell}</strong></span>
            <span>Neutral: <strong>{asset.ratingScores.neutral}</strong></span>
            <span>Buy: <strong className="text-[#089981]">{asset.ratingScores.buy}</strong></span>
          </div>
        </div>
      </div>

      {/* Detailed Indicators Breakdown (Moving Averages & Oscillators) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-[#2a2e39]/60">
        
        {/* Oscillators Table */}
        <div className={`p-3.5 rounded-xl border ${darkMode ? 'bg-[#131722] border-[#2a2e39]' : 'bg-neutral-50 border-neutral-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#787b86]">Oscillators</span>
            <span className="text-[11px] font-mono text-[#089981] font-bold">Buy ({asset.ratingScores.buy > 15 ? 4 : 2})</span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            {[
              { name: 'RSI (14)', val: '58.4', action: 'Neutral' },
              { name: 'Stochastic (14,3,3)', val: '72.1', action: 'Buy' },
              { name: 'MACD (12, 26)', val: '+14.2', action: 'Buy' },
              { name: 'CCI (20)', val: '+105.8', action: 'Buy' },
            ].map((osc) => (
              <div key={osc.name} className="flex justify-between items-center py-0.5">
                <span className={darkMode ? 'text-neutral-400' : 'text-neutral-600'}>{osc.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#787b86]">{osc.val}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    osc.action === 'Buy' ? 'text-[#089981] bg-[#089981]/10' : 'text-neutral-400 bg-neutral-800'
                  }`}>
                    {osc.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Moving Averages Table */}
        <div className={`p-3.5 rounded-xl border ${darkMode ? 'bg-[#131722] border-[#2a2e39]' : 'bg-neutral-50 border-neutral-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#787b86]">Moving Averages</span>
            <span className="text-[11px] font-mono text-[#089981] font-bold">Strong Buy ({asset.ratingScores.buy > 15 ? 13 : 9})</span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            {[
              { name: 'EMA 20', val: (asset.price * 0.985).toFixed(2), action: 'Buy' },
              { name: 'SMA 50', val: (asset.price * 0.972).toFixed(2), action: 'Buy' },
              { name: 'EMA 100', val: (asset.price * 0.955).toFixed(2), action: 'Buy' },
              { name: 'SMA 200', val: (asset.price * 0.920).toFixed(2), action: 'Buy' },
            ].map((ma) => (
              <div key={ma.name} className="flex justify-between items-center py-0.5">
                <span className={darkMode ? 'text-neutral-400' : 'text-neutral-600'}>{ma.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#787b86]">{ma.val}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold text-[#089981] bg-[#089981]/10">
                    {ma.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
