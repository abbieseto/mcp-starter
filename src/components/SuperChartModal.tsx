import React, { useState, useRef, useMemo } from 'react';
import { MarketAsset, Candle } from '../types/market';
import {
  X,
  Maximize2,
  TrendingUp,
  Sliders,
  Camera,
  Activity,
  Layers,
  MousePointer,
  Minus,
  Hash,
  Type,
  Ruler,
  Trash2,
  Check,
  Bell,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface SuperChartModalProps {
  asset: MarketAsset;
  onClose: () => void;
  darkMode: boolean;
  onToggleWatchlist: (asset: MarketAsset) => void;
  isWatchlisted: boolean;
}

export const SuperChartModal: React.FC<SuperChartModalProps> = ({
  asset,
  onClose,
  darkMode,
  onToggleWatchlist,
  isWatchlisted,
}) => {
  const [selectedTf, setSelectedTf] = useState<string>('1D');
  const [chartType, setChartType] = useState<'candles' | 'area' | 'bars'>('candles');
  const [showSMA, setShowSMA] = useState<boolean>(true);
  const [showEMA, setShowEMA] = useState<boolean>(true);
  const [showBollinger, setShowBollinger] = useState<boolean>(false);
  const [showRSI, setShowRSI] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [activeDrawingTool, setActiveDrawingTool] = useState<'crosshair' | 'line' | 'horizontal' | 'text' | 'measure'>('crosshair');
  const [drawnLines, setDrawnLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);

  // Trade execution simulation
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [tradeMessage, setTradeMessage] = useState<string | null>(null);

  // Crosshair state
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Calculate technical indicators on candle history
  const candles = asset.candles;
  const count = candles.length;

  // Chart coordinate calculations
  const chartWidth = 920;
  const mainChartHeight = showRSI ? 340 : 420;
  const rsiHeight = showRSI ? 100 : 0;
  const totalSvgHeight = mainChartHeight + rsiHeight + 30; // 30 for time axis

  const prices = useMemo(() => candles.flatMap((c) => [c.low, c.high]), [candles]);
  const minPrice = useMemo(() => Math.min(...prices) * 0.995, [prices]);
  const maxPrice = useMemo(() => Math.max(...prices) * 1.005, [prices]);
  const priceRange = maxPrice - minPrice || 1;

  // Max volume for bottom histogram
  const maxVolume = useMemo(() => Math.max(...candles.map((c) => c.volume)) || 1, [candles]);

  // SMA 20 calculation
  const sma20 = useMemo(() => {
    return candles.map((_, idx) => {
      if (idx < 10) return null;
      const slice = candles.slice(Math.max(0, idx - 14), idx + 1);
      const avg = slice.reduce((acc, c) => acc + c.close, 0) / slice.length;
      return avg;
    });
  }, [candles]);

  // EMA 50 calculation (simulated on available series)
  const ema50 = useMemo(() => {
    return candles.map((_, idx) => {
      if (idx < 5) return null;
      const slice = candles.slice(Math.max(0, idx - 20), idx + 1);
      const avg = slice.reduce((acc, c) => acc + c.close, 0) / slice.length;
      return avg * 1.002;
    });
  }, [candles]);

  // Simulated RSI (14) series (30 - 70 scale)
  const rsiSeries = useMemo(() => {
    return candles.map((c, idx) => {
      if (idx < 8) return 50;
      const mom = (c.close - candles[idx - 5].close) / candles[idx - 5].close;
      return Math.min(85, Math.max(15, 50 + mom * 600));
    });
  }, [candles]);

  // Coordinates helper
  const getY = (val: number) => {
    return mainChartHeight - ((val - minPrice) / priceRange) * (mainChartHeight - 40) - 20;
  };

  const getX = (idx: number) => {
    const margin = 30;
    const availWidth = chartWidth - margin * 2;
    return margin + (idx / (count - 1)) * availWidth;
  };

  const candleWidth = Math.max(4, Math.floor((chartWidth - 60) / count) * 0.65);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Determine nearest candle index
    const margin = 30;
    const availWidth = chartWidth - margin * 2;
    const ratio = Math.max(0, Math.min(1, (x - margin) / availWidth));
    const idx = Math.min(count - 1, Math.max(0, Math.round(ratio * (count - 1))));
    setHoverIndex(idx);

    if (isDrawing && drawStart) {
      // preview drawing
    }
  };

  const handleMouseDown = () => {
    if (activeDrawingTool === 'line' && mousePos) {
      if (!isDrawing) {
        setIsDrawing(true);
        setDrawStart({ x: mousePos.x, y: mousePos.y });
      } else if (drawStart) {
        setDrawnLines((prev) => [...prev, { x1: drawStart.x, y1: drawStart.y, x2: mousePos.x, y2: mousePos.y }]);
        setIsDrawing(false);
        setDrawStart(null);
      }
    }
  };

  const handleExecuteTrade = (type: 'BUY' | 'SELL') => {
    const fillPrice = type === 'BUY' ? (asset.price * 1.0002).toFixed(2) : (asset.price * 0.9998).toFixed(2);
    setTradeMessage(`Executed ${type} ${orderQuantity} ${asset.symbol} @ $${fillPrice}`);
    setTimeout(() => setTradeMessage(null), 3500);
  };

  const currentCandle = hoverIndex !== null ? candles[hoverIndex] : candles[candles.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-[1520px] h-[92vh] max-h-[950px] rounded-2xl flex flex-col overflow-hidden border shadow-2xl transition-colors ${
          darkMode ? 'bg-[#131722] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-neutral-300 text-neutral-800'
        }`}
      >
        {/* TOP BAR: Symbol, Timeframes, Chart Type, Indicators */}
        <div
          className={`h-14 border-b px-4 flex items-center justify-between gap-3 shrink-0 overflow-x-auto no-scrollbar ${
            darkMode ? 'bg-[#181c27] border-[#2a2e39]' : 'bg-neutral-50 border-neutral-200'
          }`}
        >
          {/* Symbol info */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className={`text-base font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                {asset.symbol}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-mono ${darkMode ? 'bg-[#2a2e39] text-[#787b86]' : 'bg-neutral-200 text-neutral-600'}`}>
                {asset.exchange}
              </span>
              <span className="hidden md:inline text-xs text-[#787b86]">{asset.name}</span>
            </div>

            {/* Live Price Tag */}
            <div className="flex items-baseline gap-2 pl-2 border-l border-[#2a2e39]">
              <span className={`font-mono text-base font-bold tabular-nums ${darkMode ? 'text-white' : 'text-neutral-950'}`}>
                {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span
                className={`font-mono text-xs font-semibold tabular-nums ${
                  asset.changePercent >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {asset.changePercent >= 0 ? `+${asset.changePercent.toFixed(2)}%` : `${asset.changePercent.toFixed(2)}%`}
              </span>
            </div>
          </div>

          {/* Timeframe & Chart Types */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Timeframe buttons */}
            <div className={`flex items-center p-0.5 rounded-lg border ${darkMode ? 'bg-[#131722] border-[#2a2e39]' : 'bg-white border-neutral-200'}`}>
              {['1m', '5m', '15m', '1h', '4h', '1D', '1W'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTf(tf)}
                  className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                    selectedTf === tf
                      ? 'bg-[#2962ff] text-white'
                      : darkMode
                      ? 'text-[#787b86] hover:text-[#d1d4dc]'
                      : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Chart Style Switcher */}
            <div className={`hidden sm:flex items-center p-0.5 rounded-lg border ${darkMode ? 'bg-[#131722] border-[#2a2e39]' : 'bg-white border-neutral-200'}`}>
              <button
                onClick={() => setChartType('candles')}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  chartType === 'candles' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                Candles
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  chartType === 'area' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                Area
              </button>
            </div>

            {/* Indicator Toggles */}
            <div className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setShowSMA(!showSMA)}
                className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
                  showSMA
                    ? 'border-[#2962ff] bg-[#2962ff]/10 text-[#2962ff]'
                    : darkMode ? 'border-[#2a2e39] text-[#787b86]' : 'border-neutral-200 text-neutral-500'
                }`}
              >
                SMA 20
              </button>
              <button
                onClick={() => setShowEMA(!showEMA)}
                className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
                  showEMA
                    ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                    : darkMode ? 'border-[#2a2e39] text-[#787b86]' : 'border-neutral-200 text-neutral-500'
                }`}
              >
                EMA 50
              </button>
              <button
                onClick={() => setShowRSI(!showRSI)}
                className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
                  showRSI
                    ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                    : darkMode ? 'border-[#2a2e39] text-[#787b86]' : 'border-neutral-200 text-neutral-500'
                }`}
              >
                RSI 14
              </button>
            </div>
          </div>

          {/* Right Tools & Close */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleWatchlist(asset)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isWatchlisted
                  ? 'bg-[#2962ff] border-[#2962ff] text-white'
                  : darkMode
                  ? 'border-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc]'
                  : 'border-neutral-200 text-neutral-600'
              }`}
              title={isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-[#2a2e39] text-[#787b86] hover:text-white' : 'hover:bg-neutral-200 text-neutral-700'
              }`}
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* OHLC Bar Inspector */}
        <div
          className={`h-9 px-4 border-b flex items-center justify-between text-xs font-mono shrink-0 ${
            darkMode ? 'bg-[#131722] border-[#2a2e39] text-[#787b86]' : 'bg-white border-neutral-200 text-neutral-500'
          }`}
        >
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
            <span>
              O: <strong className={darkMode ? 'text-white' : 'text-neutral-900'}>{currentCandle.open}</strong>
            </span>
            <span>
              H: <strong className="text-[#089981]">{currentCandle.high}</strong>
            </span>
            <span>
              L: <strong className="text-[#f23645]">{currentCandle.low}</strong>
            </span>
            <span>
              C: <strong className={currentCandle.close >= currentCandle.open ? 'text-[#089981]' : 'text-[#f23645]'}>{currentCandle.close}</strong>
            </span>
            <span>
              Vol: <strong className={darkMode ? 'text-white' : 'text-neutral-900'}>{currentCandle.volume.toLocaleString()}</strong>
            </span>
            {showSMA && <span className="text-[#2962ff]">SMA20: {sma20[hoverIndex ?? count - 1]?.toFixed(2) ?? '—'}</span>}
            {showEMA && <span className="text-amber-500">EMA50: {ema50[hoverIndex ?? count - 1]?.toFixed(2) ?? '—'}</span>}
            {showRSI && <span className="text-purple-400">RSI: {rsiSeries[hoverIndex ?? count - 1]?.toFixed(1) ?? '—'}</span>}
          </div>

          <div className="hidden sm:block text-[11px] text-[#787b86]">
            {new Date(currentCandle.timestamp).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>

        {/* BODY: Left Drawing Tools + Main Interactive SVG Chart + Right Order/Info Panel */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Drawing Tools Sidebar */}
          <div
            className={`w-12 border-r flex flex-col items-center py-3 gap-2 shrink-0 ${
              darkMode ? 'bg-[#181c27] border-[#2a2e39]' : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            {[
              { id: 'crosshair', icon: <MousePointer className="w-4 h-4" />, title: 'Crosshair' },
              { id: 'line', icon: <Minus className="w-4 h-4 rotate-45" />, title: 'Trendline' },
              { id: 'horizontal', icon: <Minus className="w-4 h-4" />, title: 'Horizontal Ray' },
              { id: 'measure', icon: <Ruler className="w-4 h-4" />, title: 'Price Range Ruler' },
              { id: 'text', icon: <Type className="w-4 h-4" />, title: 'Text Note' },
            ].map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveDrawingTool(tool.id as any)}
                className={`p-2 rounded-lg transition-colors ${
                  activeDrawingTool === tool.id
                    ? 'bg-[#2962ff] text-white shadow-xs'
                    : darkMode
                    ? 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#202533]'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                }`}
                title={tool.title}
              >
                {tool.icon}
              </button>
            ))}

            <div className="w-6 h-px bg-[#2a2e39] my-1" />

            <button
              onClick={() => setDrawnLines([])}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'text-[#787b86] hover:text-[#f23645] hover:bg-[#202533]' : 'text-neutral-500 hover:text-red-600 hover:bg-neutral-200'
              }`}
              title="Clear all drawings"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Center Chart Viewport */}
          <div
            ref={chartContainerRef}
            className="flex-1 relative overflow-hidden flex flex-col select-none cursor-crosshair"
          >
            {/* SVG Interactive Canvas */}
            <div className="flex-1 w-full h-full relative">
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${chartWidth} ${totalSvgHeight}`}
                preserveAspectRatio="none"
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseLeave={() => {
                  setHoverIndex(null);
                  setMousePos(null);
                }}
                className="w-full h-full"
              >
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2962ff" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0.2, 0.4, 0.6, 0.8].map((pct) => {
                  const y = mainChartHeight * pct;
                  const priceAtY = maxPrice - pct * priceRange;
                  return (
                    <g key={pct}>
                      <line
                        x1="0"
                        y1={y}
                        x2={chartWidth}
                        y2={y}
                        stroke={darkMode ? '#1f2430' : '#e5e7eb'}
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      <text
                        x={chartWidth - 8}
                        y={y - 4}
                        textAnchor="end"
                        fill={darkMode ? '#787b86' : '#9ca3af'}
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {priceAtY.toFixed(2)}
                      </text>
                    </g>
                  );
                })}

                {/* Bollinger Bands Shaded Area */}
                {showBollinger && (
                  <path
                    d={`M ${candles.map((c, i) => `${getX(i)},${getY(c.high * 1.008)}`).join(' L ')} L ${candles
                      .slice()
                      .reverse()
                      .map((c, i) => `${getX(count - 1 - i)},${getY(c.low * 0.992)}`)
                      .join(' L ')} Z`}
                    fill="#2962ff"
                    fillOpacity="0.06"
                  />
                )}

                {/* Volume Histogram (bottom of main chart) */}
                {showVolume && (
                  <g>
                    {candles.map((c, i) => {
                      const x = getX(i);
                      const barH = (c.volume / maxVolume) * 60;
                      const y = mainChartHeight - barH;
                      const isUp = c.close >= c.open;
                      return (
                        <rect
                          key={`vol-${i}`}
                          x={x - candleWidth / 2}
                          y={y}
                          width={candleWidth}
                          height={barH}
                          fill={isUp ? '#089981' : '#f23645'}
                          fillOpacity="0.25"
                        />
                      );
                    })}
                  </g>
                )}

                {/* Area Chart Mode */}
                {chartType === 'area' && (
                  <g>
                    <path
                      d={`M ${candles.map((c, i) => `${getX(i)},${getY(c.close)}`).join(' L ')} L ${getX(count - 1)},${mainChartHeight} L ${getX(0)},${mainChartHeight} Z`}
                      fill="url(#areaGrad)"
                    />
                    <path
                      d={`M ${candles.map((c, i) => `${getX(i)},${getY(c.close)}`).join(' L ')}`}
                      fill="none"
                      stroke="#2962ff"
                      strokeWidth="2"
                    />
                  </g>
                )}

                {/* Candlestick Chart Mode */}
                {chartType === 'candles' && (
                  <g>
                    {candles.map((c, i) => {
                      const x = getX(i);
                      const isUp = c.close >= c.open;
                      const openY = getY(c.open);
                      const closeY = getY(c.close);
                      const highY = getY(c.high);
                      const lowY = getY(c.low);
                      const top = Math.min(openY, closeY);
                      const bodyHeight = Math.max(2, Math.abs(closeY - openY));

                      return (
                        <g key={`candle-${i}`}>
                          {/* Wick */}
                          <line
                            x1={x}
                            y1={highY}
                            x2={x}
                            y2={lowY}
                            stroke={isUp ? '#089981' : '#f23645'}
                            strokeWidth="1.25"
                          />
                          {/* Body */}
                          <rect
                            x={x - candleWidth / 2}
                            y={top}
                            width={candleWidth}
                            height={bodyHeight}
                            fill={isUp ? '#089981' : '#f23645'}
                            stroke={isUp ? '#089981' : '#f23645'}
                            strokeWidth="0.5"
                            rx="1"
                          />
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* SMA 20 Overlay */}
                {showSMA && (
                  <path
                    d={`M ${candles
                      .map((_, i) => (sma20[i] ? `${getX(i)},${getY(sma20[i]!)}` : null))
                      .filter(Boolean)
                      .join(' L ')}`}
                    fill="none"
                    stroke="#2962ff"
                    strokeWidth="1.75"
                  />
                )}

                {/* EMA 50 Overlay */}
                {showEMA && (
                  <path
                    d={`M ${candles
                      .map((_, i) => (ema50[i] ? `${getX(i)},${getY(ema50[i]!)}` : null))
                      .filter(Boolean)
                      .join(' L ')}`}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.75"
                  />
                )}

                {/* User Drawn Trendlines */}
                {drawnLines.map((line, idx) => (
                  <line
                    key={`line-${idx}`}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="#2962ff"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                ))}

                {/* RSI Sub-Pane */}
                {showRSI && (
                  <g transform={`translate(0, ${mainChartHeight})`}>
                    <line x1="0" y1="0" x2={chartWidth} y2="0" stroke={darkMode ? '#2a2e39' : '#e5e7eb'} strokeWidth="1" />
                    
                    {/* RSI 70 & 30 lines */}
                    <line x1="0" y1="30" x2={chartWidth} y2="30" stroke="#f23645" strokeDasharray="3 3" strokeOpacity="0.4" />
                    <line x1="0" y1="70" x2={chartWidth} y2="70" stroke="#089981" strokeDasharray="3 3" strokeOpacity="0.4" />
                    
                    <text x="10" y="24" fill="#a855f7" fontSize="10" fontWeight="bold">RSI (14)</text>
                    <text x={chartWidth - 8} y="32" textAnchor="end" fill="#f23645" fontSize="9">70</text>
                    <text x={chartWidth - 8} y="72" textAnchor="end" fill="#089981" fontSize="9">30</text>

                    {/* RSI Curve */}
                    <path
                      d={`M ${candles.map((_, i) => `${getX(i)},${100 - rsiSeries[i]}`).join(' L ')}`}
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="1.5"
                    />
                  </g>
                )}

                {/* Active Interactive Crosshair */}
                {mousePos && hoverIndex !== null && (
                  <g>
                    {/* Vertical line */}
                    <line
                      x1={getX(hoverIndex)}
                      y1="0"
                      x2={getX(hoverIndex)}
                      y2={totalSvgHeight}
                      stroke={darkMode ? '#787b86' : '#9ca3af'}
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />

                    {/* Horizontal line */}
                    <line
                      x1="0"
                      y1={mousePos.y}
                      x2={chartWidth}
                      y2={mousePos.y}
                      stroke={darkMode ? '#787b86' : '#9ca3af'}
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />

                    {/* Price tag on right axis */}
                    <rect
                      x={chartWidth - 62}
                      y={mousePos.y - 10}
                      width="60"
                      height="20"
                      fill="#2962ff"
                      rx="2"
                    />
                    <text
                      x={chartWidth - 32}
                      y={mousePos.y + 4}
                      textAnchor="middle"
                      fill="white"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {(maxPrice - (mousePos.y / mainChartHeight) * priceRange).toFixed(2)}
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Simulated trade execution banner */}
            {tradeMessage && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#089981] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
                <Check className="w-4 h-4" />
                <span>{tradeMessage}</span>
              </div>
            )}
          </div>

          {/* Right Panel: Instant Order Execution + Depth + Technical Consensus */}
          <div
            className={`w-72 border-l p-4 flex flex-col justify-between overflow-y-auto shrink-0 ${
              darkMode ? 'bg-[#181c27] border-[#2a2e39]' : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <div className="space-y-4">
              {/* Order Execution Widget */}
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#787b86]' : 'text-neutral-500'}`}>
                  Place Order
                </h4>
                
                {/* Buy / Sell dual buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleExecuteTrade('BUY')}
                    className="p-3 rounded-lg bg-[#089981] hover:bg-[#078570] text-white flex flex-col items-center justify-center transition-transform active:scale-95"
                  >
                    <span className="text-xs font-bold flex items-center gap-1">
                      <ArrowUp className="w-3.5 h-3.5" /> BUY
                    </span>
                    <span className="font-mono text-xs font-black tabular-nums mt-0.5">
                      {(asset.price * 1.0002).toFixed(2)}
                    </span>
                  </button>

                  <button
                    onClick={() => handleExecuteTrade('SELL')}
                    className="p-3 rounded-lg bg-[#f23645] hover:bg-[#d92a38] text-white flex flex-col items-center justify-center transition-transform active:scale-95"
                  >
                    <span className="text-xs font-bold flex items-center gap-1">
                      <ArrowDown className="w-3.5 h-3.5" /> SELL
                    </span>
                    <span className="font-mono text-xs font-black tabular-nums mt-0.5">
                      {(asset.price * 0.9998).toFixed(2)}
                    </span>
                  </button>
                </div>

                {/* Quantity Input */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={darkMode ? 'text-[#787b86]' : 'text-neutral-500'}>Quantity</span>
                    <span className="font-mono font-semibold">{orderQuantity}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Number(e.target.value))}
                    className="w-full accent-[#2962ff]"
                  />
                </div>
              </div>

              {/* Technical Analysis Consensus Speedometer Preview */}
              <div className={`p-3 rounded-xl border ${darkMode ? 'bg-[#131722] border-[#2a2e39]' : 'bg-white border-neutral-200'}`}>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold">Technical Rating</span>
                  <span
                    className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded ${
                      asset.technicalRating.includes('Buy')
                        ? 'bg-[#089981]/20 text-[#089981]'
                        : asset.technicalRating.includes('Sell')
                        ? 'bg-[#f23645]/20 text-[#f23645]'
                        : 'bg-amber-500/20 text-amber-500'
                    }`}
                  >
                    {asset.technicalRating}
                  </span>
                </div>

                {/* Score breakdown pills */}
                <div className="grid grid-cols-3 gap-1 text-center font-mono text-xs mt-2">
                  <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-500">
                    <div className="text-[10px] uppercase font-sans">Buy</div>
                    <div className="font-bold">{asset.ratingScores.buy}</div>
                  </div>
                  <div className="p-1.5 rounded bg-neutral-500/10 text-neutral-400">
                    <div className="text-[10px] uppercase font-sans">Neutral</div>
                    <div className="font-bold">{asset.ratingScores.neutral}</div>
                  </div>
                  <div className="p-1.5 rounded bg-red-500/10 text-red-500">
                    <div className="text-[10px] uppercase font-sans">Sell</div>
                    <div className="font-bold">{asset.ratingScores.sell}</div>
                  </div>
                </div>
              </div>

              {/* Level 2 Depth Snapshot */}
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-[#787b86]' : 'text-neutral-500'}`}>
                  Order Book (Depth)
                </h4>
                <div className="space-y-1 font-mono text-[11px] tabular-nums">
                  {/* Ask rows */}
                  {[
                    { p: (asset.price + 0.35).toFixed(2), size: 1420 },
                    { p: (asset.price + 0.15).toFixed(2), size: 840 },
                  ].map((row, i) => (
                    <div key={`ask-${i}`} className="flex justify-between text-[#f23645] bg-[#f23645]/5 px-2 py-0.5 rounded">
                      <span>{row.p}</span>
                      <span>{row.size}</span>
                    </div>
                  ))}

                  {/* Spread */}
                  <div className="text-center text-[10px] py-0.5 text-[#787b86]">
                    Spread: 0.04 (0.01%)
                  </div>

                  {/* Bid rows */}
                  {[
                    { p: (asset.price - 0.12).toFixed(2), size: 1100 },
                    { p: (asset.price - 0.28).toFixed(2), size: 1890 },
                  ].map((row, i) => (
                    <div key={`bid-${i}`} className="flex justify-between text-[#089981] bg-[#089981]/5 px-2 py-0.5 rounded">
                      <span>{row.p}</span>
                      <span>{row.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Asset Statistics */}
            <div className={`mt-4 pt-4 border-t text-xs space-y-1.5 font-mono ${darkMode ? 'border-[#2a2e39] text-[#787b86]' : 'border-neutral-200 text-neutral-500'}`}>
              <div className="flex justify-between">
                <span>52W High</span>
                <span className={darkMode ? 'text-white' : 'text-neutral-900'}>{asset.yearRange.high.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>52W Low</span>
                <span className={darkMode ? 'text-white' : 'text-neutral-900'}>{asset.yearRange.low.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Volume</span>
                <span className={darkMode ? 'text-white' : 'text-neutral-900'}>{asset.volume}</span>
              </div>
              {asset.marketCap && (
                <div className="flex justify-between">
                  <span>Market Cap</span>
                  <span className={darkMode ? 'text-white' : 'text-neutral-900'}>{asset.marketCap}</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
