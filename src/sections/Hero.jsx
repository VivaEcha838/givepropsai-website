import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChartBarIcon,
  BuildingOffice2Icon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";
import StatCard from "../components/StatCard";
import { COMBINED } from "../data/constants";

const audiences = [
  {
    key: "analysts",
    label: "Analysts",
    icon: ChartBarIcon,
    headline: "Smarter Pitcher Prop Predictions",
    sub: `Three ML models covering Strikeouts, Walks, and Hits Allowed with ${(COMBINED.winRate * 100).toFixed(1)}% win rate identifying mispriced lines across ${COMBINED.totalPredictions.toLocaleString()} out-of-sample predictions validated against real sportsbook lines. All models statistically significant.`,
  },
  {
    key: "sportsbooks",
    label: "Sportsbooks",
    icon: BuildingOffice2Icon,
    headline: "Sharpen Your Lines",
    sub: "Quantile-regression probabilities expose mispriced K, BB, and Hits Allowed props before the market corrects. Protect your hold with our API feed.",
  },
  {
    key: "data",
    label: "Data Partners",
    icon: CircleStackIcon,
    headline: "Licensed Probability Feeds",
    sub: "Triple-model XGBoost ensemble with calibrated under/over probabilities for pitcher strikeouts, walks, and hits allowed, every game. Plug into your platform.",
  },
];

export default function Hero() {
  const [activeTab, setActiveTab] = useState("analysts");
  const active = audiences.find((a) => a.key === activeTab);

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-16 grid-pattern">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-2 mb-6 flex-wrap"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            {COMBINED.totalPredictions.toLocaleString()} mispriced lines identified across 14 months OOS
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {COMBINED.models} Models &mdash; {(COMBINED.winRate * 100).toFixed(1)}% Win Rate
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-4"
        >
          <span className="text-white">MLB Pitcher Prop</span>
          <br />
          <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
            Intelligence
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center text-lg text-gray-400 max-w-2xl mx-auto mb-10"
        >
          Triple-quantile XGBoost ensemble covering strikeouts, walks, and hits allowed with walk-forward validation.
          Zero data leakage. Calibrated probabilities. {COMBINED.models} models, {COMBINED.totalPredictions.toLocaleString()} OOS predictions.
        </motion.p>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-14"
        >
          <StatCard
            label="Win Rate"
            value={`${(COMBINED.winRate * 100).toFixed(1)}%`}
            sub={`${COMBINED.totalPredictions.toLocaleString()} OOS predictions`}
            accent="amber"
          />
          <StatCard
            label="Predictions/mo"
            value={`~${COMBINED.predictionsPerMonth}`}
            sub="mispriced lines identified"
            accent="emerald"
          />
          <StatCard
            label="Models"
            value={COMBINED.models}
            sub="Ks + BBs + Hits"
            accent="violet"
          />
          <StatCard
            label="Props Covered"
            value={COMBINED.props.length}
            sub="All pitcher props"
            accent="cyan"
          />
        </motion.div>

        {/* Audience tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex justify-center gap-2 mb-6">
            {audiences.map((a) => (
              <button
                key={a.key}
                onClick={() => setActiveTab(a.key)}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${
                    activeTab === a.key
                      ? "bg-gray-800 text-white border border-gray-700 shadow-lg"
                      : "bg-transparent text-gray-500 hover:text-gray-300 border border-transparent"
                  }
                `}
              >
                <a.icon className="w-4 h-4" />
                {a.label}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center bg-gray-900/50 border border-gray-800 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-2">{active.headline}</h2>
            <p className="text-gray-400 max-w-xl mx-auto">{active.sub}</p>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-gray-700 flex items-start justify-center p-1.5"
          >
            <div className="w-1 h-2 bg-gray-500 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
