import { motion } from "framer-motion";
import { season2026, dailyResults, lastUpdated } from "../data/live_data";
import {
  TrophyIcon,
  ChartBarSquareIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";

function StatBig({ value, label, sub, accent }) {
  const colors = {
    amber:   "text-amber-400",
    emerald: "text-emerald-400",
    violet:  "text-violet-400",
    cyan:    "text-cyan-400",
    rose:    "text-rose-400",
  };
  return (
    <div className="text-center">
      <p className={`text-3xl md:text-5xl font-black font-mono ${colors[accent] || "text-white"}`}>
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
      {sub && <p className="text-[10px] text-gray-600 mt-0.5">{sub}</p>}
    </div>
  );
}

function DayRow({ day }) {
  const sign = day.pl >= 0 ? "+" : "";
  const signR = day.runningPl >= 0 ? "+" : "";
  const wl = `${day.wins}-${day.losses}`;
  const dateShort = day.date.slice(5).replace("-", "/");
  return (
    <tr className="border-t border-gray-800">
      <td className="py-2 px-3 text-xs text-gray-400 font-mono">{dateShort}</td>
      <td className="py-2 px-3 text-xs text-white font-mono">{wl}</td>
      <td className={`py-2 px-3 text-xs font-mono font-semibold ${day.pl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
        {sign}${day.pl.toFixed(2)}
      </td>
      <td className={`py-2 px-3 text-xs font-mono font-semibold ${day.runningPl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
        {signR}${day.runningPl.toFixed(2)}
      </td>
    </tr>
  );
}

export default function ResultsShowcase() {
  const { record, winRate, pl, roi, picks, days, byMarket } = season2026;
  const plSign = pl >= 0 ? "+" : "";

  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-900/80 border border-gray-800 rounded-3xl p-8 md:p-10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              2026 Season &middot; Live Forward Test &middot; V2 Filter
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              2026 Live Results
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {picks} picks across {days} days (Apr 5 – Apr 12, 2026)
            </p>
          </div>

          {/* Big Numbers Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatBig
              value={record}
              label="Record"
              sub={`${picks} picks · ${days} days`}
              accent="amber"
            />
            <StatBig
              value={`${winRate}%`}
              label="Win Rate"
              sub="52.4% = market-implied"
              accent="emerald"
            />
            <StatBig
              value={`${plSign}$${pl.toFixed(2)}`}
              label="P&L"
              sub="$100 flat bet"
              accent="violet"
            />
            <StatBig
              value={`${plSign}${roi}%`}
              label="ROI"
              sub="return on investment"
              accent="cyan"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 my-6" />

          {/* Market Breakdown */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <TrophyIcon className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">By Market</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(byMarket).map(([short, m]) => {
                const total = m.w + m.l;
                const wr = total > 0 ? ((m.w / total) * 100).toFixed(1) : "—";
                return (
                  <div key={short} className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 text-center">
                    <p className="text-xs font-bold tracking-wider text-amber-400 mb-1">{short}</p>
                    <p className="text-2xl font-black font-mono text-white">
                      {m.w}-{m.l}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">{m.label}</p>
                    <p className="text-xs font-mono text-gray-600 mt-0.5">{m.w + m.l} picks</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day-by-day table */}
          {dailyResults.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ChartBarSquareIcon className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Day-by-Day Results</h3>
              </div>
              <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800/60">
                      <th className="py-2 px-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="py-2 px-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">W-L</th>
                      <th className="py-2 px-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Day P&L</th>
                      <th className="py-2 px-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Running</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyResults.map((day) => (
                      <DayRow key={day.date} day={day} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer disclaimer */}
          <p className="text-[10px] text-gray-600 text-center mt-6">
            Forward test from April 5, 2026 &middot; V2 filter applied &middot; $100 flat bet &middot; Last updated {lastUpdated}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
