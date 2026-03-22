import { useState } from "react";
import { motion } from "framer-motion";
import PickCard from "../components/PickCard";
import { mockPicks } from "../data/picks";
import { FunnelIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

const MARKET_TABS = [
  { key: "all", label: "All Markets", short: "All" },
  { key: "strikeouts", label: "Strikeouts", short: "K" },
  { key: "walks", label: "Walks", short: "BB" },
  { key: "hits", label: "Hits Allowed", short: "H" },
];

export default function PicksDashboard() {
  const [showMispricedOnly, setShowMispricedOnly] = useState(false);
  const [activeMarket, setActiveMarket] = useState("all");

  let picks = showMispricedOnly
    ? mockPicks.filter((p) => p.isMispriced)
    : mockPicks;

  if (activeMarket !== "all") {
    picks = picks.filter((p) => p.market === activeMarket);
  }

  const sortedPicks = [...picks].sort((a, b) => (b.confidenceScore || b.edge) - (a.confidenceScore || a.edge));
  const mispricedCount = mockPicks.filter((p) => p.isMispriced).length;

  // Count per market
  const marketCounts = {
    all: mockPicks.filter((p) => p.isMispriced).length,
    strikeouts: mockPicks.filter((p) => p.isMispriced && p.market === "strikeouts").length,
    walks: mockPicks.filter((p) => p.isMispriced && p.market === "walks").length,
    hits: mockPicks.filter((p) => p.isMispriced && p.market === "hits").length,
  };

  return (
    <section id="picks" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-6"
        >
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">
              Today's Slate
            </h2>
            <p className="text-gray-400">
              {mockPicks.length} matchups analyzed across 3 markets &middot;{" "}
              <span className="text-amber-400 font-semibold">{mispricedCount} mispriced lines found</span>
            </p>
          </div>

          {/* Filter toggle */}
          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            <button
              onClick={() => setShowMispricedOnly(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                !showMispricedOnly
                  ? "bg-gray-800 text-white border border-gray-700"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Squares2X2Icon className="w-3.5 h-3.5" />
              All
            </button>
            <button
              onClick={() => setShowMispricedOnly(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                showMispricedOnly
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <FunnelIcon className="w-3.5 h-3.5" />
              Mispriced Only
            </button>
          </div>
        </motion.div>

        {/* Market tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {MARKET_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveMarket(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeMarket === tab.key
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-gray-900/50 text-gray-400 border border-gray-800 hover:text-gray-200 hover:border-gray-700"
              }`}
            >
              {tab.label}
              {marketCounts[tab.key] > 0 && (
                <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                  activeMarket === tab.key
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-gray-800 text-gray-500"
                }`}>
                  {marketCounts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Pick cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedPicks.map((pick, i) => (
            <motion.div
              key={pick.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <PickCard pick={pick} />
            </motion.div>
          ))}
        </div>

        {sortedPicks.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No picks in this category today.
          </div>
        )}

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            ELITE &mdash; highest model confidence
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            PREMIUM &mdash; backtested edge, historically positive tier
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            STRONG &mdash; moderate edge, tracked
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-500" />
            STANDARD &mdash; model-tracked only
          </div>
        </motion.div>
      </div>
    </section>
  );
}
