import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  ShieldExclamationIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";

/**
 * RiskWatchlist
 * Displays mispriced picks the V2 filter rejected, with human-readable reasons.
 * Purpose: transparency + education. Bettors see what we chose NOT to play and
 * why — reinforcing that we are an analytics service with rigorous structural
 * filters, not a sprayed-edge service.
 */
function WatchlistRow({ pick }) {
  const [expanded, setExpanded] = useState(false);
  const matchup = pick.isHome
    ? `${pick.oppTeam} @ ${pick.pitcherTeam}`
    : `${pick.pitcherTeam} @ ${pick.oppTeam}`;
  const edgeSign = pick.edge >= 0 ? "+" : "";

  return (
    <motion.div
      layout
      className="bg-rose-500/5 border border-rose-500/20 rounded-xl overflow-hidden hover:border-rose-500/40 transition-colors cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <XCircleIcon className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-white truncate">{pick.pitcherName}</h4>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  pick.marketShort === "K"
                    ? "bg-blue-500/10 text-blue-400"
                    : pick.marketShort === "BB"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-orange-500/10 text-orange-400"
                }`}
              >
                {pick.marketLabel} U {pick.consensusLine?.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-gray-500">{matchup}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
              Model edge
            </p>
            <p className="text-sm font-mono font-semibold text-emerald-400">
              {edgeSign}
              {pick.edge?.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-rose-300 uppercase tracking-wider font-semibold">
              Filtered
            </p>
            <p className="text-[11px] text-rose-400 font-medium">
              {pick.rejectionReasons?.length || 0} reason
              {pick.rejectionReasons?.length === 1 ? "" : "s"}
            </p>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && pick.rejectionReasons && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-rose-500/20 pt-3 space-y-2.5">
              {pick.rejectionReasons.map((r, i) => (
                <div
                  key={i}
                  className="bg-rose-500/5 rounded-lg px-3 py-2 border border-rose-500/10"
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-rose-200">
                        {r.label}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                        {r.detail}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                <span>
                  Model projected {pick.modelPred?.toFixed(1)} vs line{" "}
                  {pick.consensusLine?.toFixed(1)} · conf{" "}
                  {pick.confidenceScore?.toFixed(2)}
                </span>
                <span className="italic">
                  This pick did NOT make today's published slate.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function RiskWatchlist({ filteredOut }) {
  if (!filteredOut || filteredOut.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-start justify-between mb-4 flex-col sm:flex-row gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldExclamationIcon className="w-5 h-5 text-rose-400" />
            <h3 className="text-xl font-bold text-white">
              Why We Skipped These
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-rose-500/10 border border-rose-500/30 text-rose-300">
              Risk Watchlist
            </span>
          </div>
          <p className="text-gray-400 text-sm max-w-2xl">
            The model found edge here but our structural filters rejected them.
            Click any row to see the reasoning — this is the work you're not
            seeing on most services.
          </p>
        </div>
        <div className="text-[11px] text-gray-500 sm:text-right">
          <div>
            {filteredOut.length} mispriced pick
            {filteredOut.length === 1 ? "" : "s"} filtered
          </div>
          <div className="text-gray-600 italic">
            Transparency &gt; hit rate
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {filteredOut.map((pick) => (
          <WatchlistRow key={pick.id} pick={pick} />
        ))}
      </div>

      <div className="mt-4 p-4 bg-slate-500/5 border border-slate-500/20 rounded-lg">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          How we decide what to filter
        </h4>
        <ul className="text-xs text-gray-400 space-y-1.5 leading-relaxed">
          <li>
            <span className="text-slate-200 font-semibold">
              Volatile walks history
            </span>{" "}
            — 3+ walks in ≥25% of recent starts means the model underestimates
            tail risk.
          </li>
          <li>
            <span className="text-slate-200 font-semibold">
              Injury-return flag
            </span>{" "}
            — pitchers back from surgery/IL whose model projections lean on
            stale pre-injury stats.
          </li>
          <li>
            <span className="text-slate-200 font-semibold">
              Power-arm + low K line
            </span>{" "}
            — career K% &gt;25% with an Under line ≤6.5 is a structurally
            losing bet regardless of matchup.
          </li>
          <li>
            <span className="text-slate-200 font-semibold">
              Home-team K unders
            </span>{" "}
            — home starters go deeper on average, giving more opportunity to
            hit the Over.
          </li>
          <li>
            <span className="text-slate-200 font-semibold">
              Walks confidence gate
            </span>{" "}
            — below 0.60 model confidence on walks has historically been
            negative ROI.
          </li>
        </ul>
      </div>
    </div>
  );
}
