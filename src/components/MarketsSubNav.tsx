import React from 'react';
import { LayoutGrid, TrendingUp, BarChart2, Bitcoin, DollarSign, Flame, Calendar, Newspaper, Activity } from 'lucide-react';

export type SubNavId = 'overview' | 'indices' | 'stocks' | 'crypto' | 'forex' | 'futures' | 'bonds' | 'heatmap' | 'calendar' | 'news';

interface MarketsSubNavProps {
  activeTab: SubNavId;
  onTabChange: (tab: SubNavId) => void;
  darkMode: boolean;
}

export const MarketsSubNav: React.FC<MarketsSubNavProps> = ({
  activeTab,
  onTabChange,
  darkMode,
}) => {
  const tabs: { id: SubNavId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'indices', label: 'Indices', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'stocks', label: 'Stocks', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'crypto', label: 'Crypto', icon: <Bitcoin className="w-4 h-4" /> },
    { id: 'forex', label: 'Forex', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'futures', label: 'Futures & Commodities', icon: <Flame className="w-4 h-4" /> },
    { id: 'bonds', label: 'Bonds & Yields', icon: <Activity className="w-4 h-4" /> },
    { id: 'heatmap', label: 'Stock Heatmap', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'calendar', label: 'Economic Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'news', label: 'News & Ideas', icon: <Newspaper className="w-4 h-4" /> },
  ];

  return (
    <div
      className={`border-b sticky top-14 z-30 transition-colors ${
        darkMode ? 'bg-[#131722] border-[#2a2e39]' : 'bg-white border-neutral-200'
      }`}
    >
      <div className="max-w-[1720px] mx-auto px-4 lg:px-6">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#2962ff] text-white shadow-xs'
                    : darkMode
                    ? 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#1e222d]'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
