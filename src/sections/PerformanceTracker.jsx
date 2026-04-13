import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine,
} from "recharts";
import { dailyResults, season2026 } from "../data/live_data";
import { ArrowTrendingUpIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0]?.payload;
    const sign = d.runningPl >= 0 ? "+" : "";
    const daySign = d.pl >= 0 ? "+" : "";
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-gray-400 mb-1">Apr {d.dateShort}</p>
        <p className="font-mono text-emerald-400">Running: {sign}${d.runningPl.toFixed(2)}</p>
        <p className="font-mono text-gray-300">Day P&L: {daySign}${d.pl.toFixed(2)}</p>
        <p className="font-mono text-gray-500">{d.wins}-{d.losses} ({d.wins + d.losses} picks)</p>
      </div>
    );
  }
  return null;
};

// Build chart data: start with a $0 point, then each day
function buildChartData() {
  const data = [{ dateShort: "Start", runningPl: 0, pl: 0, wins: 0, losses: 0 }];
  for (const day of dailyResults) {
    const parts = day.date.split("-");
    const dateShort = `${parseInt(parts[1])}/${parseInt(parts[2])}`;
    data.push({
      dateShort,
      runningPl: day.runningPl,
      pl: day.pl,
      wins: day.wins,
      losses: day.losses,
    });
  }
  return data;
}

export default function PerformanceTracker() {
  const chartData = buildChartData();
  const { winRate, roi, days, pl, picks } = season2026;
  const plSign = pl >= 0 ? "+" : "";
  const lastPl = chartData[chartData.length - 1]?.runningPl ?? 0;

  return (
    <section id="performance" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-1">Performance</h2>
          <p className="text-gray-400">2026 live forward test — V2 filter applied</p>
        </motion.div>

        {/* P&L Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">2026 Live Performance — V2 Filter</h3>
            </div>
            <span className="text-xl font-black font-mono text-emerald-400">
              {plSign}${lastPl.toFixed(2)}
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="plGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis
                  dataKey="dateShort"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#374151" strokeWidth={1} />
                <Area
                  type="monotone"
                  dataKey="runningPl"
                  name="Running P&L"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#plGradient)"
                  dot={{ fill: "#f59e0b", r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#f59e0b" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[10px] text-gray-600 text-center mt-3">
            April 5–{days > 0 ? `${days} days` : "—"}, 2026 &middot; $100 flat bet &middot; V2 filter
          </p>
        </motion.div>

        {/* Summary stats below the chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
        >
          {[
            { label: "Win Rate",    value: `${winRate}%`,       accent: "text-amber-400" },
            { label: "ROI",         value: `${plSign}${roi}%`,  accent: "text-emerald-400" },
            { label: "Days Tracked", value: days,               accent: "text-violet-400" },
            { label: "Total Picks", value: picks,               accent: "text-cyan-400" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
              <p className={`text-2xl font-black font-mono ${s.accent}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Methodology note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6"
        >
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Methodology Transparency</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-500">
                <div>
                  <p className="text-gray-400 font-medium mb-1">V2 Filter</p>
                  <p>confidence ≥ 0.35, experience ≥ 0.97x, away K only, excludes HIGH_K/TALENTED_K/VOLATILE_BB arms. Walks require p_under ≥ 0.55.</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium mb-1">Tracking Method</p>
                  <p>$100 flat bet per pick at best available line. Results pulled from official box scores. No cherry-picking — all V2 picks tracked.</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium mb-1">Forward Test Start</p>
                  <p>V2 filter locked in before April 5, 2026. No retroactive changes to the tracked record. Filter updates tracked separately.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
