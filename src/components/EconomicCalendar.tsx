import React, { useState } from 'react';
import { ECONOMIC_EVENTS } from '../data/marketData';
import { Calendar, AlertCircle, Clock, Globe } from 'lucide-react';

interface EconomicCalendarProps {
  darkMode: boolean;
}

export const EconomicCalendar: React.FC<EconomicCalendarProps> = ({ darkMode }) => {
  const [impactFilter, setImpactFilter] = useState<'All' | 'High' | 'Medium'>('All');

  const filteredEvents = impactFilter === 'All'
    ? ECONOMIC_EVENTS
    : ECONOMIC_EVENTS.filter((e) => e.impact === impactFilter);

  return (
    <div className="py-6 space-y-4">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#2962ff]" />
            <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
              Economic Calendar
            </h2>
          </div>
          <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? 'text-[#787b86]' : 'text-neutral-500'}`}>
            High-impact macroeconomic event releases, central bank rate decisions, CPI reports, and employment figures.
          </p>
        </div>

        {/* Impact Filter */}
        <div className={`flex items-center p-1 rounded-lg border self-start sm:self-auto ${
          darkMode ? 'bg-[#181c27] border-[#2a2e39]' : 'bg-neutral-100 border-neutral-200'
        }`}>
          {(['All', 'High', 'Medium'] as const).map((imp) => (
            <button
              key={imp}
              onClick={() => setImpactFilter(imp)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                impactFilter === imp
                  ? darkMode
                    ? 'bg-[#2a2e39] text-white shadow-xs'
                    : 'bg-white text-neutral-900 shadow-xs'
                  : darkMode
                  ? 'text-[#787b86] hover:text-[#d1d4dc]'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {imp === 'All' ? 'All Impacts' : `${imp} Impact`}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Table Container */}
      <div
        className={`rounded-2xl border overflow-hidden transition-colors ${
          darkMode ? 'bg-[#131722] border-[#2a2e39]' : 'bg-white border-neutral-200 shadow-xs'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr
                className={`border-b text-[11px] font-semibold uppercase tracking-wider ${
                  darkMode ? 'bg-[#181c27] border-[#2a2e39] text-[#787b86]' : 'bg-neutral-50 border-neutral-200 text-neutral-500'
                }`}
              >
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-3">Country</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-3 text-center">Impact</th>
                <th className="py-3 px-4 text-right">Actual</th>
                <th className="py-3 px-4 text-right">Forecast</th>
                <th className="py-3 px-4 text-right">Previous</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200 dark:divide-[#2a2e39]/60">
              {filteredEvents.map((evt) => (
                <tr
                  key={evt.id}
                  className={`transition-colors ${
                    darkMode ? 'hover:bg-[#1e222d] text-[#d1d4dc]' : 'hover:bg-neutral-50 text-neutral-800'
                  }`}
                >
                  {/* Date & Time */}
                  <td className="py-3.5 px-4 font-mono">
                    <div className={darkMode ? 'text-white' : 'text-neutral-900'}>{evt.date}</div>
                    <div className="text-[10px] text-[#787b86]">{evt.time}</div>
                  </td>

                  {/* Country Flag & Code */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{evt.flag}</span>
                      <span className="font-semibold text-xs">{evt.country}</span>
                    </div>
                  </td>

                  {/* Event Title */}
                  <td className="py-3.5 px-4">
                    <div className={`font-semibold ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                      {evt.title}
                    </div>
                  </td>

                  {/* Impact Tag */}
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        evt.impact === 'High'
                          ? 'bg-[#f23645]/15 text-[#f23645]'
                          : 'bg-amber-500/15 text-amber-500'
                      }`}
                    >
                      {evt.impact}
                    </span>
                  </td>

                  {/* Actual */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums">
                    {evt.actual ? (
                      <span className="text-[#089981] bg-[#089981]/10 px-1.5 py-0.5 rounded">
                        {evt.actual}
                      </span>
                    ) : (
                      <span className="text-[#787b86]">Pending</span>
                    )}
                  </td>

                  {/* Forecast */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#787b86]">
                    {evt.forecast}
                  </td>

                  {/* Previous */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#787b86]">
                    {evt.previous}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
