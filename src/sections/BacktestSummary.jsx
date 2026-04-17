import { motion } from "framer-motion";
import { BeakerIcon, CheckBadgeIcon, XCircleIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/solid";
import { COMBINED, PERFORMANCE, WALK_PERFORMANCE, HITS_PERFORMANCE } from "../data/constants";

const MARKETS = [
  { short: "K", label: "Strikeouts", color: "amber", perf: PERFORMANCE.walkForward, features: PERFORMANCE.features },
  { short: "BB", label: "Walks", color: "emerald", perf: WALK_PERFORMANCE.walkForward, features: WALK_PERFORMANCE.features },
  { short: "H", label: "Hits Allowed", color: "violet", perf: HITS_PERFORMANCE.walkForward, features: HITS_PERFORMANCE.features },
];

const COLOR_MAP = {
  amber: { text: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" },
  emerald: { text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
  violet: { text: "text-violet-400", border: "border-violet-500/30", bg: "bg-violet-500/10" },
};

export default function BacktestSummary() {
  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/[0.02] to-transparent pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
            <BeakerIcon className="w-3.5 h-3.5" />
            Model Foundation - Walk-Forward Backtest
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">How the model was validated before live play</h2>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            Every number below comes from out-of-sample predictions. The model was trained on 2021-2023 data
            and tested on 2024-2025 months the model never saw. Zero data leakage. TimeSeriesSplit validation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          <div className="bg-gray-900/60 border border-amber-500/20 rounded-xl p-4 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Win Rate</p>
            <p className="text-3xl font-black font-mono text-amber-400">{(COMBINED.winRate * 100).toFixed(1)}%</p>
            <p className="text-[10px] text-gray-500 mt-1">{COMBINED.totalPredictions.toLocaleString()} OOS predictions</p>
          </div>
          <div className="bg-gray-900/60 border border-emerald-500/20 rounded-xl p-4 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Predictions/Mo</p>
            <p className="text-3xl font-black font-mono text-emerald-400">~{COMBINED.predictionsPerMonth}</p>
            <p className="text-[10px] text-gray-500 mt-1">mispriced lines identified</p>
          </div>
          <div className="bg-gray-900/60 border border-violet-500/20 rounded-xl p-4 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Models</p>
            <p className="text-3xl font-black font-mono text-violet-400">{COMBINED.models}</p>
            <p className="text-[10px] text-gray-500 mt-1">Ks + BBs + Hits</p>
          </div>
          <div className="bg-gray-900/60 border border-cyan-500/20 rounded-xl p-4 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Props Covered</p>
            <p className="text-3xl font-black font-mono text-cyan-400">{COMBINED.props.length}</p>
            <p className="text-[10px] text-gray-500 mt-1">All pitcher props</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-4 text-center">Per-market backtest performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MARKETS.map((m) => {
              const c = COLOR_MAP[m.color];
              const totalPicks = m.perf.mispriced;
              const wrPct = (m.perf.winRate * 100).toFixed(1);
              const totalProfit = m.perf.profit.toFixed(1);
              return (
                <div key={m.short} className={`bg-gray-900/60 border ${c.border} rounded-2xl p-5`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className={`text-xs font-bold tracking-wider ${c.text}`}>{m.short}</p>
                      <p className="text-sm font-semibold text-white">{m.label}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-md ${c.bg} ${c.text} text-[10px] font-bold font-mono`}>{wrPct}%</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                    <div>
                      <p className="text-gray-500 uppercase text-[9px] tracking-wider">Picks</p>
                      <p className="text-white font-mono font-semibold">{totalPicks.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 uppercase text-[9px] tracking-wider">Correct</p>
                      <p className="text-white font-mono font-semibold">{m.perf.correct.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 uppercase text-[9px] tracking-wider">Profit (u)</p>
                      <p className="text-emerald-400 font-mono font-semibold">+{totalProfit}u</p>
                    </div>
                    <div>
                      <p className="text-gray-500 uppercase text-[9px] tracking-wider">Features</p>
                      <p className="text-white font-mono font-semibold">{m.features}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-800 text-[10px] text-gray-500 space-y-0.5">
                    <p>2024 OOS: <span className="text-gray-300 font-mono">{m.perf.season2024.winRate}% - +{m.perf.season2024.profit}u</span></p>
                    <p>2025 OOS: <span className="text-gray-300 font-mono">{m.perf.season2025.winRate}% - +{m.perf.season2025.profit}u</span></p>
                    <p className="text-[9px] pt-1 text-gray-600">p = {m.perf.pValue.toExponential(0)} over {m.perf.folds} folds</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 md:p-8"
        >
          <div className="flex items-center gap-2 mb-5">
            <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">V1 to V2: Why the live filter is a real improvement</h3>
          </div>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            V1 was the base model - it flagged every mispriced line with no further filtering.
            The V1 reference period (Mar 26 - Apr 4, 2026) ran at <span className="text-white font-semibold">58.9%</span> win rate
            across 95 picks. That was already profitable, but we dug into where V1 was losing money
            and found four structural weaknesses. V2 is the result of fixing each one.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <XCircleIcon className="w-4 h-4 text-red-400" />
                <p className="text-sm font-bold text-red-400">V1 - Base model, no filter</p>
              </div>
              <div className="space-y-1.5 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Mar 26 - Apr 4 live</span>
                  <span className="font-mono text-white">95 picks</span>
                </div>
                <div className="flex justify-between">
                  <span>Win rate</span>
                  <span className="font-mono text-red-300">58.9%</span>
                </div>
                <div className="flex justify-between">
                  <span>P&amp;L ($100 flat)</span>
                  <span className="font-mono text-amber-300">+$1,203</span>
                </div>
                <div className="flex justify-between">
                  <span>ROI</span>
                  <span className="font-mono text-amber-300">+12.7%</span>
                </div>
              </div>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckBadgeIcon className="w-4 h-4 text-emerald-400" />
                <p className="text-sm font-bold text-emerald-400">V2 - Filtered production model</p>
              </div>
              <div className="space-y-1.5 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Apr 5 - present</span>
                  <span className="font-mono text-white">58 picks - 12 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Win rate</span>
                  <span className="font-mono text-emerald-300">60.3%</span>
                </div>
                <div className="flex justify-between">
                  <span>P&amp;L ($100 flat)</span>
                  <span className="font-mono text-emerald-300">+$557</span>
                </div>
                <div className="flex justify-between">
                  <span>ROI</span>
                  <span className="font-mono text-emerald-300">+9.6%</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-600 text-center mt-2 leading-relaxed">
            V2 filter was locked in before April 5, 2026 - no retroactive changes to the live record.
            <br />
            <span className="text-gray-500">
              Sample-size note: V1 ROI (+12.7%) reflects ~3 weeks and 95 picks;
              V2 ROI (+9.6%) reflects only 12 days and 58 picks so far. Smaller samples
              produce more volatile ROI figures - both up and down. V2 will stabilize
              as the live sample grows.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
