import React, { useState } from 'react';
import { MARKET_NEWS, TRADING_IDEAS } from '../data/marketData';
import { Newspaper, Lightbulb, ThumbsUp, MessageSquare, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';

interface MarketNewsAndIdeasProps {
  darkMode: boolean;
  onOpenChartForSymbol: (symbol: string) => void;
}

export const MarketNewsAndIdeas: React.FC<MarketNewsAndIdeasProps> = ({
  darkMode,
  onOpenChartForSymbol,
}) => {
  const [activeTab, setActiveTab] = useState<'news' | 'ideas'>('news');
  const [likedIdeas, setLikedIdeas] = useState<{ [id: string]: boolean }>({});

  const toggleLike = (ideaId: string) => {
    setLikedIdeas((prev) => ({ ...prev, [ideaId]: !prev[ideaId] }));
  };

  return (
    <div className="py-6 space-y-6">
      {/* Header & Section Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
            Market News & Trading Ideas
          </h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? 'text-[#787b86]' : 'text-neutral-500'}`}>
            Curated financial headlines, macroeconomic developments, and community technical setups.
          </p>
        </div>

        {/* Tab switcher */}
        <div className={`flex items-center p-1 rounded-lg border self-start sm:self-auto ${
          darkMode ? 'bg-[#181c27] border-[#2a2e39]' : 'bg-neutral-100 border-neutral-200'
        }`}>
          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'news'
                ? darkMode ? 'bg-[#2a2e39] text-white shadow-xs' : 'bg-white text-neutral-900 shadow-xs'
                : darkMode ? 'text-[#787b86] hover:text-[#d1d4dc]' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>Top News</span>
          </button>
          <button
            onClick={() => setActiveTab('ideas')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'ideas'
                ? darkMode ? 'bg-[#2a2e39] text-white shadow-xs' : 'bg-white text-neutral-900 shadow-xs'
                : darkMode ? 'text-[#787b86] hover:text-[#d1d4dc]' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Analyst Ideas</span>
          </button>
        </div>
      </div>

      {/* NEWS TAB CONTENT */}
      {activeTab === 'news' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MARKET_NEWS.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all hover:border-[#2962ff]/50 group ${
                darkMode ? 'bg-[#181c27] border-[#2a2e39]' : 'bg-white border-neutral-200 shadow-xs'
              }`}
            >
              <div>
                {/* News Image with zero-broken fallback */}
                <div className="relative h-44 overflow-hidden bg-neutral-900">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-900 to-slate-800 text-[#787b86]">
                      <Newspaper className="w-8 h-8" />
                    </div>
                  )}

                  {/* Gradient Scrim for Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Category & Sentiment Tag */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-white/90 drop-shadow-sm">
                      {item.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.sentiment === 'Bullish'
                          ? 'bg-[#089981] text-white'
                          : item.sentiment === 'Bearish'
                          ? 'bg-[#f23645] text-white'
                          : 'bg-neutral-700 text-white'
                      }`}
                    >
                      {item.sentiment}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-xs text-[#787b86] mb-2 font-mono">
                    <span>{item.source}</span>
                    <span>·</span>
                    <span>{item.timestamp}</span>
                  </div>

                  <h3 className={`text-sm sm:text-base font-bold leading-snug group-hover:text-[#2962ff] transition-colors ${
                    darkMode ? 'text-white' : 'text-neutral-900'
                  }`}>
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#787b86] mt-2 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Related symbols ticker links */}
              <div className="p-4 sm:p-5 pt-0 border-t border-[#2a2e39]/50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.symbols.map((sym) => (
                    <button
                      key={sym}
                      onClick={() => onOpenChartForSymbol(sym)}
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded transition-colors ${
                        darkMode
                          ? 'bg-[#2a2e39] text-[#2962ff] hover:bg-[#2962ff] hover:text-white'
                          : 'bg-neutral-100 text-[#2962ff] hover:bg-[#2962ff] hover:text-white'
                      }`}
                    >
                      ${sym}
                    </button>
                  ))}
                </div>

                <ArrowUpRight className="w-4 h-4 text-[#787b86] group-hover:text-[#2962ff] transition-colors" />
              </div>
            </article>
          ))}
        </div>
      )}

      {/* TRADING IDEAS TAB CONTENT */}
      {activeTab === 'ideas' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TRADING_IDEAS.map((idea) => {
            const isLiked = likedIdeas[idea.id];
            const isLong = idea.side === 'Long';

            return (
              <div
                key={idea.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all hover:border-[#2962ff]/50 ${
                  darkMode ? 'bg-[#181c27] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-neutral-200 shadow-xs text-neutral-800'
                }`}
              >
                <div>
                  {/* Author Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#2962ff] text-white font-bold text-xs flex items-center justify-center">
                        {idea.author.slice(0, 1)}
                      </div>
                      <div>
                        <div className="text-xs font-bold">{idea.author}</div>
                        <div className="text-[10px] text-[#787b86]">{idea.authorBadge} · {idea.timestamp}</div>
                      </div>
                    </div>

                    {/* Long / Short Indicator */}
                    <span
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        isLong ? 'bg-[#089981]/15 text-[#089981]' : 'bg-[#f23645]/15 text-[#f23645]'
                      }`}
                    >
                      {isLong ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {idea.side.toUpperCase()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`text-sm font-bold leading-snug mb-2 ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                    {idea.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#787b86] line-clamp-4 leading-relaxed mb-4">
                    {idea.description}
                  </p>

                  {/* Key Metrics: Target & Timeframe */}
                  <div className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between mb-4 ${
                    darkMode ? 'bg-[#131722] border-[#2a2e39]' : 'bg-neutral-50 border-neutral-200'
                  }`}>
                    <span>Target: <strong className={darkMode ? 'text-white' : 'text-neutral-950'}>{idea.targetPrice}</strong></span>
                    <span>TF: <strong className="text-[#2962ff]">{idea.timeframe}</strong></span>
                  </div>
                </div>

                {/* Footer Actions: Likes, Comments & Chart Link */}
                <div className="flex items-center justify-between pt-3 border-t border-[#2a2e39]/60 text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleLike(idea.id)}
                      className={`flex items-center gap-1 font-mono transition-colors ${
                        isLiked ? 'text-[#2962ff] font-bold' : 'text-[#787b86] hover:text-[#d1d4dc]'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#2962ff]' : ''}`} />
                      <span>{isLiked ? idea.likes + 1 : idea.likes}</span>
                    </button>

                    <div className="flex items-center gap-1 text-[#787b86] font-mono">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{idea.comments}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenChartForSymbol(idea.symbol)}
                    className="text-xs font-semibold text-[#2962ff] hover:underline flex items-center gap-1"
                  >
                    <span>View {idea.symbol} Chart</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
