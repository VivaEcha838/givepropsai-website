import { motion } from "framer-motion";
import {
  FireIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/solid";
import results from "../data/_results.json";

/**
 * RecentStretch — internal-only panel showing the model's run since
 * a configurable start date (currently 4/20, the over-side launch +
 * series of tuning changes).  Reads `recentStretch` from _results.json
 * which is populated by build_results_json.py each run.
 *
 * Purposely INTERNAL only — shows P/L and ROI which the consumer site
 * deliberately doesn't display per the compliance guide.
 */
const fmtSigned = (n, digits = 2) =>
  `${n >= 0 ? "+" : ""}${Number(n).toFixed(digits)}`;

const MARKET_LABEL = { K: "Strikeouts", BB: "Walks", H: "Hits Allowed" };
const MARKET_COLOR = {
  K: "border-sky-500/40 bg-sky-500/5 text-sky-300",
  BB: "border-violet-500/40 bg-violet-500/5 text-violet-300",
  H: "border-amber-500/40 bg-amber-500/5 text-amber-300",
};

export default function RecentStretch() {
  const rs = results.recentStretch;
  if (!rs || !rs.totalPicks) return null;

  const startMd = (rs.startDate || "").slice(5).replace("-", "/");

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-12 border-t border-gray-900 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <FireIcon className="w-6 h-6 text-orange-400" />
          <h2 className="text-2xl font-bold text-white">
            Recent Stretch · since {startMd}
          </h2>
          <span className="text-[10px] uppercase tracking-widest text-orange-300 bg-orange-500/10 border border-orange-500/30 rounded-full px-2 py-0.5">
            {rs.days} days
          </span>
        </div>
        <p className="text-gray-400 text-sm mb-6">
          The model's run since the over-side launch and threshold tuning
          changes.
        </p>

        {/* Top-line stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Stat
            icon={<ChartBarIcon className="w-5 h-5" />}
            label="Record"
            value={`${rs.wins}–${rs.losses}`}
            sub={`${rs.totalPicks} picks`}
            tint="amber"
          />
          <Stat
            icon={<ArrowTrendingUpIcon className="w-5 h-5" />}
            label="Win Rate"
            value={`${rs.winRate.toFixed(1)}%`}
            sub={`${rs.wins} of ${rs.totalPicks}`}
            tint={rs.winRate >= 60 ? "emerald" : "rose"}
          />
          <Stat
            icon={<CurrencyDollarIcon className="w-5 h-5" />}
            label="P/L"
            value={`${rs.profit >= 0 ? "+$" : "-$"}${Math.abs(rs.profit).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            sub="cumulative"
            tint={rs.profit >= 0 ? "emerald" : "rose"}
          />
          <Stat
            icon={<FireIcon className="w-5 h-5" />}
            label="ROI"
            value={`${fmtSigned(rs.roi, 1)}%`}
            sub={`vs −110 baseline`}
            tint={rs.roi >= 0 ? "emerald" : "rose"}
          />
        </div>

        {/* By market */}
        {rs.byMarket && Object.keys(rs.byMarket).length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2">
              By market
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(rs.byMarket).map(([k, v]) => {
                const n = v.wins + v.losses;
                const roi = n > 0 ? (v.profit / (n * 100)) * 100 : 0;
                return (
                  <div
                    key={k}
                    className={`rounded-xl border px-4 py-3 ${MARKET_COLOR[k] || "border-gray-800 bg-gray-900/40 text-gray-300"}`}
                  >
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-[11px] uppercase tracking-wider font-bold">
                        {MARKET_LABEL[k] || k}
                      </span>
                      <span className="font-mono text-xs text-gray-400">
                        {v.wins}–{v.losses}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3 font-mono">
                      <span className="text-lg font-bold">
                        {v.winRate.toFixed(1)}%
                      </span>
                      <span
                        className={
                          v.profit >= 0 ? "text-emerald-400" : "text-rose-400"
                        }
                      >
                        {v.profit >= 0 ? "+$" : "-$"}
                        {Math.abs(v.profit).toFixed(2)}
                      </span>
                      <span
                        className={`text-xs ${roi >= 0 ? "text-emerald-300/80" : "text-rose-300/80"}`}
                      >
                        ROI {fmtSigned(roi, 1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}

function Stat({ icon, label, value, sub, tint }) {
  const colors = {
    amber: { border: "border-amber-500/30", glow: "from-amber-500/15", text: "text-white" },
    emerald: { border: "border-emerald-500/30", glow: "from-emerald-500/15", text: "text-emerald-400" },
    rose: { border: "border-rose-500/30", glow: "from-rose-500/15", text: "text-rose-400" },
  };
  const c = colors[tint] || colors.amber;
  return (
    <div className={`relative bg-gray-900/60 border ${c.border} rounded-2xl p-4 overflow-hidden shadow-lg`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${c.glow} via-transparent to-transparent pointer-events-none`} />
      <div className="relative flex items-start justify-between mb-2">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">
          {label}
        </p>
        <span className={`${c.text} opacity-70`}>{icon}</span>
      </div>
      <p className={`relative text-2xl font-bold font-mono ${c.text}`}>{value}</p>
      <p className="relative text-[11px] text-gray-500 mt-1">{sub}</p>
    </div>
  );
}
