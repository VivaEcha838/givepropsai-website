import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import TierBadge from "./TierBadge";
import ProbabilityGauge from "./ProbabilityGauge";
import LineupSurpriseIndicator from "./LineupSurpriseIndicator";
import BatterKRateTable from "./BatterKRateTable";
import ConfidenceBandChart from "./ConfidenceBandChart";
import { GLOBAL_AVG_KR } from "../data/constants";

export default function PickCard({ pick }) {
  const [expanded, setExpanded] = useState(false);

  const edgeSign = pick.edge >= 0 ? "+" : "";
  const matchup = pick.isHome
    ? `${pick.oppTeam} @ ${pick.pitcherTeam}`
    : `${pick.pitcherTeam} @ ${pick.oppTeam}`;

  const tierGlow = {
    ELITE: "hover:shadow-amber-500/10 hover:border-amber-500/30",
    PREMIUM: "hover:shadow-violet-500/10 hover:border-violet-500/30",
    STRONG: "hover:shadow-cyan-500/10 hover:border-cyan-500/30",
    STANDARD: "hover:shadow-gray-500/10 hover:border-gray-500/30",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl overflow-hidden
        transition-all duration-300 cursor-pointer
        hover:shadow-xl ${tierGlow[pick.tier]}
      `}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Main card content */}
      <div className="p-5">
        {/* Top row: pitcher + tier */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-white">
              {pick.pitcherName}
              <span className="ml-2 text-xs text-gray-500 font-normal">
                {pick.handedness}HP
              </span>
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-400">{matchup}</p>
              {pick.marketShort && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  pick.marketShort === "K" ? "bg-blue-500/10 text-blue-400" :
                  pick.marketShort === "BB" ? "bg-emerald-500/10 text-emerald-400" :
                  "bg-orange-500/10 text-orange-400"
                }`}>
                  {pick.marketLabel || pick.marketShort}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {pick.side === "over" ? (
              <span
                title="Model predicts OVER the line"
                className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30"
              >
                ▲ OVER
              </span>
            ) : (
              <span
                title="Model predicts UNDER the line"
                className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
              >
                ▼ UNDER
              </span>
            )}
            {pick.hcFlag && (
              <span
                title="Sharp Play — model confidence ≥ 0.65"
                className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30"
              >
                ⭐ SHARP
              </span>
            )}
            {pick.riskNotes && pick.riskNotes.length > 0 && (
              <span
                title={`${pick.riskNotes.length} risk factor${pick.riskNotes.length === 1 ? "" : "s"} — click card to read`}
                className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-500/15 text-slate-300 border border-slate-500/30"
              >
                <ExclamationTriangleIcon className="w-3 h-3" />
                WHY RISKY
              </span>
            )}
            {pick.tierTrial && (
              <span
                title={pick.trialNote || "Trial tier — new market segment under live evaluation"}
                className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/30"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-pulse" />
                TRIAL
              </span>
            )}
            <TierBadge tier={pick.tier} />
          </div>
        </div>

        {/* Prediction row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Model</p>
            <p className="text-xl font-bold font-mono text-white">
              {pick.modelPred.toFixed(1)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
              {pick.side === "over" ? "Over" : "Under"} Line
            </p>
            <p className={`text-xl font-bold font-mono ${
              pick.side === "over" ? "text-sky-300" : "text-gray-300"
            }`}>
              {pick.side === "over" ? "▲ " : "▼ "}
              {pick.consensusLine.toFixed(1)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Edge</p>
            <p
              className={`text-xl font-bold font-mono ${
                pick.edge > 0
                  ? "text-emerald-400"
                  : pick.edge < 0
                    ? "text-rose-400"
                    : "text-gray-400"
              }`}
            >
              {edgeSign}{pick.edge.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Probability gauge */}
        <ProbabilityGauge pUnder={pick.pUnder} tier={pick.tier} />

        {/* Bottom row: lineup surprise + expand */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500">Lineup:</span>
            <LineupSurpriseIndicator value={pick.lineupSurprise} />
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          </motion.div>
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gray-800 pt-4 space-y-5">
              {/* Risk Notes — educational context when signal is softer */}
              {pick.riskNotes && pick.riskNotes.length > 0 && (
                <div className="bg-slate-500/5 border border-slate-500/20 rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                    Why this pick is speculative
                  </h4>
                  <ul className="space-y-2">
                    {pick.riskNotes.map((note, i) => (
                      <li key={i} className="text-xs">
                        <div className="font-semibold text-slate-200">{note.label}</div>
                        <div className="text-slate-400 mt-0.5">{note.detail}</div>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-slate-500 mt-3 italic">
                    The model still sees edge — but bettors should understand what makes this pick softer than a Sharp play.
                  </p>
                </div>
              )}

              {/* Key Driving Factors */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Key Factors
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {pick.keyFactors.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2"
                    >
                      <span className="text-xs text-gray-400">{f.name}</span>
                      <span
                        className={`text-xs font-mono font-semibold ${
                          f.direction === "up"
                            ? "text-emerald-400"
                            : f.direction === "down"
                              ? "text-rose-400"
                              : "text-gray-400"
                        }`}
                      >
                        {f.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confidence Band Chart */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Confidence Band (Q35 / Q50 / Q65)
                </h4>
                <ConfidenceBandChart
                  quantiles={pick.quantiles}
                  consensusLine={pick.consensusLine}
                  tier={pick.tier}
                />
              </div>

              {/* Batter K-Rate Table */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Opposing Lineup Rates
                </h4>
                <BatterKRateTable batters={pick.batters} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
