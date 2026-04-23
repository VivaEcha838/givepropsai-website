import { useState } from "react";
import { motion } from "framer-motion";
import PickCard from "../components/PickCard";
import RiskWatchlist from "../components/RiskWatchlist";
import ArchetypeWatchlist from "../components/ArchetypeWatchlist";
import {
  todayV2Picks,
  todayExpPicks,
  todayFilteredOut,
  todayArchetypeWatchlist,
} from "../data/live_data";
import { FunnelIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

const MARKET_TABS = [
  { key: "all", label: "All Markets", short: "All" },
  { key: "strikeouts", label: "Strikeouts", short: "K" },
  { key: "walks", label: "Walks", short: "BB" },
  { key: "hits", label: "Hits Allowed", short: "H" },
];

function PickSection({ title, subtitle, picks, badge }) {
  const [showMispricedOnly, setShowMispricedOnly] = useState(false);
  const [activeMarket, setActiveMarket] = useState("all");

  let filtered = showMispricedOnly ? picks.filter((p) => p.isMispriced) : picks;
  if (activeMarket !== "all") {
    filtered = filtered.filter((p) => p.market === activeMarket);
  }
  const sorted = [...filtered].sort((a, b) => (b.confidenceScore || b.edge || 0) - (a.confidenceScore || a.edge || 0));

  const marketCounts = {
    all: picks.filter((p) => p.isMispriced).length,
    strikeouts: picks.filter((p) => p.isMispriced && p.market === "strikeouts").length,
    walks: picks.filter((p) => p.isMispriced && p.market === "walks").length,
    hits: picks.filter((p) => p.isMispriced && p.market === "hits").length,
  };

  return (
    <div className="mb-12">
      {/* Section label */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            {badge && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${badge.cls}`}>
                {badge.label}
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm">{subtitle}</p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center gap-2">
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
      </div>

      {/* Market tabs */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
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

      {/* Pick cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sorted.map((pick, i) => (
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

      {sorted.length === 0 && (
        <div className="text-center py-12 text-gray-500 text-sm">
          No picks in this category today.
        </div>
      )}
    </div>
  );
}

export default function PicksDashboard() {
  const totalPicks = todayV2Picks.length + todayExpPicks.length;
  const mispricedCount = todayV2Picks.filter((p) => p.isMispriced).length;

  // Split V2 picks into Core (Sharp, no risk notes) vs Speculative (rest)
  const corePicks = todayV2Picks.filter(
    (p) => p.hcFlag && (!p.riskNotes || p.riskNotes.length === 0)
  );
  const speculativePicks = todayV2Picks.filter(
    (p) => !p.hcFlag || (p.riskNotes && p.riskNotes.length > 0)
  );

  return (
    <section id="picks" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-1">Today's Slate</h2>
          <p className="text-gray-400">
            {totalPicks} matchups analyzed across 3 markets &middot;{" "}
            <span className="text-amber-400 font-semibold">{mispricedCount} mispriced lines found</span>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Core plays = ⭐ Sharp (conf ≥ 0.65) · Speculative = softer signal or limited data (educational context provided)
          </p>
        </motion.div>

        {/* Core Plays — Sharp, no risk flags */}
        {corePicks.length > 0 && (
          <PickSection
            title="Core Plays"
            subtitle={`${corePicks.length} ⭐ Sharp pick${corePicks.length === 1 ? "" : "s"} · highest conviction of the slate`}
            picks={corePicks}
            badge={{ label: "⭐ Sharp · Core", cls: "bg-amber-500/10 border border-amber-500/30 text-amber-300" }}
          />
        )}

        {/* Speculative — lower conviction or limited data */}
        {speculativePicks.length > 0 && (
          <PickSection
            title="Speculative"
            subtitle={`${speculativePicks.length} pick${speculativePicks.length === 1 ? "" : "s"} · lower conviction — see risk notes before acting`}
            picks={speculativePicks}
            badge={{ label: "Educational", cls: "bg-slate-500/10 border border-slate-500/30 text-slate-300" }}
          />
        )}

        {/* EXP Picks */}
        {todayExpPicks.length > 0 && (
          <PickSection
            title="EXP Home K"
            subtitle={`${todayExpPicks.length} picks · experimental, tracked separately`}
            picks={todayExpPicks}
            badge={{ label: "EXP · Experimental", cls: "bg-violet-500/10 border border-violet-500/20 text-violet-400" }}
          />
        )}

        {/* Archetype Watchlist — manual-review candidates where model disagrees with archetype */}
        <ArchetypeWatchlist watchlist={todayArchetypeWatchlist} />

        {/* Risk Watchlist — transparency on filtered-out picks */}
        <RiskWatchlist filteredOut={todayFilteredOut} />

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            ELITE &mdash; highest model confidence
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            PREMIUM &mdash; strong edge, historically positive tier
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
