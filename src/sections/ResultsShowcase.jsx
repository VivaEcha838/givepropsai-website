import { useState } from "react";
import { motion } from "framer-motion";
import { PERFORMANCE, WALK_PERFORMANCE, HITS_PERFORMANCE, COMBINED } from "../data/constants";
import { tierPerformance, perSeasonResults, walkTierPerformance, walkPerSeasonResults, hitsTierPerformance, hitsPerSeasonResults } from "../data/history";
import {
  TrophyIcon,
  ChartBarSquareIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";

const MODELS = [
  {
    key: "combined",
    label: "Combined",
    accent: "emerald",
    activeClass: "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400",
    winRate: (COMBINED.winRate * 100).toFixed(1),
    profit: COMBINED.profit,
    pValue: COMBINED.pValue.toExponential(1),
    totalPredictions: COMBINED.totalPredictions,
    desc: `${COMBINED.totalPredictions.toLocaleString()} mispriced lines identified across ${COMBINED.models} models`,
    tiers: null,
    seasons: null,
  },
  {
    key: "strikeouts",
    label: "Strikeouts",
    accent: "amber",
    activeClass: "bg-amber-500/20 border border-amber-500/30 text-amber-400",
    winRate: (PERFORMANCE.walkForward.winRate * 100).toFixed(1),
    profit: PERFORMANCE.walkForward.profit,
    pValue: PERFORMANCE.walkForward.pValue,
    totalPredictions: PERFORMANCE.walkForward.mispriced,
    desc: `${PERFORMANCE.walkForward.mispriced.toLocaleString()} Elite predictions across 14-month rolling backtest (2024-2025)`,
    tiers: tierPerformance,
    seasons: perSeasonResults,
  },
  {
    key: "walks",
    label: "Walks",
    accent: "cyan",
    activeClass: "bg-cyan-500/20 border border-cyan-500/30 text-cyan-400",
    winRate: (WALK_PERFORMANCE.walkForward.winRate * 100).toFixed(1),
    profit: WALK_PERFORMANCE.walkForward.profit,
    pValue: WALK_PERFORMANCE.walkForward.pValue,
    totalPredictions: WALK_PERFORMANCE.walkForward.mispriced,
    desc: `${WALK_PERFORMANCE.walkForward.mispriced.toLocaleString()} predictions across 14-month rolling backtest (2024-2025)`,
    tiers: walkTierPerformance,
    seasons: walkPerSeasonResults,
  },
  {
    key: "hits",
    label: "Hits Allowed",
    accent: "rose",
    activeClass: "bg-rose-500/20 border border-rose-500/30 text-rose-400",
    winRate: (HITS_PERFORMANCE.walkForward.winRate * 100).toFixed(1),
    profit: HITS_PERFORMANCE.walkForward.profit,
    pValue: HITS_PERFORMANCE.walkForward.pValue,
    totalPredictions: HITS_PERFORMANCE.walkForward.mispriced,
    desc: `${HITS_PERFORMANCE.walkForward.mispriced.toLocaleString()} predictions across 14-month rolling backtest (2024-2025)`,
    tiers: hitsTierPerformance,
    seasons: hitsPerSeasonResults,
  },
];

export default function ResultsShowcase() {
  const [activeModel, setActiveModel] = useState("combined");
  const model = MODELS.find((m) => m.key === activeModel);

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              Walk-Forward Validated &middot; Real Sportsbook Lines &middot; Zero Data Leakage
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Out-of-Sample Results
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {model.desc} &mdash; model never trained on test data
            </p>
          </div>

          {/* Model tabs */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {MODELS.map((m) => (
              <button
                key={m.key}
                onClick={() => setActiveModel(m.key)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeModel === m.key
                    ? m.activeClass
                    : "bg-gray-800/50 border border-gray-700/50 text-gray-500 hover:text-gray-300"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Big Numbers Row */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="text-center">
              <p className="text-3xl md:text-5xl font-black font-mono text-amber-400">
                {model.winRate}<span className="text-xl md:text-3xl">%</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">Win Rate</p>
              <p className="text-[10px] text-gray-600">(52.4% = market-implied)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-5xl font-black font-mono text-emerald-400">
                {model.totalPredictions.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Mispricings Found</p>
              <p className="text-[10px] text-gray-600">out-of-sample predictions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-5xl font-black font-mono text-violet-400">
                {model.pValue}
              </p>
              <p className="text-xs text-gray-500 mt-1">p-Value</p>
              <p className="text-[10px] text-gray-600">Statistically significant</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 my-6" />

          {/* Tier Breakdown */}
          {model.tiers && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <TrophyIcon className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">
                  {model.tiers.length === 1 ? "Elite Tier Only — Strongest Edge" : "All Tiers Above Market"}
                </h3>
              </div>
              <div className={`grid gap-3 ${model.tiers.length === 1 ? "grid-cols-1 max-w-sm mx-auto" : "grid-cols-2"}`}>
                {model.tiers.map((t) => (
                    <div
                      key={t.tier}
                      className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 text-center"
                    >
                      <p
                        className="text-xs font-bold tracking-wider mb-1"
                        style={{ color: t.color }}
                      >
                        {t.tier}
                      </p>
                      <p className="text-2xl md:text-3xl font-black font-mono text-white">
                        {t.winRate}<span className="text-sm">%</span>
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {t.correct} / {t.predictions} correct
                      </p>
                      <p className={`text-xs font-mono mt-1 ${t.profit > 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {t.profit > 0 ? "+" : ""}{t.profit}u edge
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Combined summary when no tiers */}
          {!model.tiers && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <TrophyIcon className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Model Breakdown</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {MODELS.filter((m) => m.key !== "combined").map((m) => (
                  <div
                    key={m.key}
                    className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs text-gray-500">Pitcher {m.label}</p>
                      <p className="text-lg font-bold text-white font-mono">
                        {m.winRate}% Win Rate
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {m.totalPredictions.toLocaleString()} predictions
                      </p>
                    </div>
                    <p className="text-xl font-black font-mono text-emerald-400">
                      +{m.profit}u
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Per Season */}
          {model.seasons && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ChartBarSquareIcon className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">
                  {model.seasons.length > 1 ? "Consistent Across Seasons" : "Season Performance"}
                </h3>
              </div>
              <div className={`grid gap-3 ${model.seasons.length === 1 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-2"}`}>
                {model.seasons.map((s) => (
                  <div
                    key={s.season}
                    className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs text-gray-500">{s.season} Season</p>
                      <p className="text-lg font-bold text-white font-mono">
                        {s.winRate}% Win Rate
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {s.predictions} predictions &middot; {s.correct} correct
                      </p>
                    </div>
                    <p
                      className={`text-xl font-black font-mono ${
                        s.profit > 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      +{s.profit}u
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer note */}
          <p className="text-[10px] text-gray-600 text-center mt-6">
            All results from rolling monthly walk-forward backtest using real historical sportsbook consensus lines.
            Strategy: Edge + AB_agree (both models predict under). Zero look-ahead bias. Independently verifiable.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
