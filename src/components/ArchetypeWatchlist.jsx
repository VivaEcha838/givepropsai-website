import { motion } from "framer-motion";
import { EyeIcon } from "@heroicons/react/24/outline";

/**
 * ArchetypeWatchlist
 *
 * Manual-review bucket for OVER picks where the archetype says OVER but
 * the ML model predicts UNDER. We do NOT publish these as picks
 * (backtest: 47.9% WR, -8.6% ROI on 497 historical cases) — they're
 * surfaced here so the bettor can make a context-aware call (e.g. a
 * post-TJ pitcher whose leash is known to be extended tonight).
 */
const MARKET_LABEL = {
  strikeouts: "Strikeouts",
  walks: "Walks",
  hits: "Hits Allowed",
};

const MARKET_COLOR = {
  K: { bg: "bg-sky-500/10", border: "border-sky-500/30", text: "text-sky-300" },
  BB: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-300" },
  H: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-300" },
};

function Row({ pick }) {
  const c = MARKET_COLOR[pick.marketShort] || MARKET_COLOR.K;
  const matchup = pick.isHome ? `vs ${pick.oppTeam}` : `@ ${pick.oppTeam}`;
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="font-bold text-white">{pick.pitcherName}</span>
          <span className="text-xs text-gray-500">{matchup}</span>
          <span
            className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${c.bg} ${c.border} ${c.text}`}
          >
            {MARKET_LABEL[pick.market] || pick.market} · Over{" "}
            {pick.consensusLine?.toFixed(1)}
          </span>
        </div>
        <div className="text-[10px] text-gray-500 font-mono text-right">
          model: {pick.modelPred?.toFixed(2)}
          <br />
          line: {pick.consensusLine?.toFixed(1)}
        </div>
      </div>
      <div className="flex items-start gap-2">
        <span className="inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 shrink-0">
          {pick.signal}
        </span>
        <p className="text-xs text-gray-400 leading-relaxed">{pick.reason}</p>
      </div>
    </div>
  );
}

export default function ArchetypeWatchlist({ watchlist }) {
  if (!watchlist || watchlist.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <div className="flex items-start justify-between mb-4 flex-col sm:flex-row gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <EyeIcon className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-bold text-white">
              Archetype Watchlist
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-300">
              Model Disagrees
            </span>
          </div>
          <p className="text-gray-400 text-sm max-w-2xl">
            Archetype says OVER, model says UNDER. We don't auto-publish these
            (backtest: 47.9% WR on 497 historical cases) — but they're the
            spots where <em>your context</em> can matter: leash extensions,
            known matchup quirks, weather shifts the model doesn't see.
          </p>
        </div>
        <div className="text-[11px] text-gray-500 sm:text-right">
          <div>
            {watchlist.length} watchlist pick
            {watchlist.length === 1 ? "" : "s"}
          </div>
          <div className="text-gray-600 italic">Manual review only</div>
        </div>
      </div>

      <div className="space-y-2">
        {watchlist.map((pick, i) => (
          <Row key={`${pick.pitcherName}-${pick.market}-${i}`} pick={pick} />
        ))}
      </div>
    </motion.div>
  );
}
