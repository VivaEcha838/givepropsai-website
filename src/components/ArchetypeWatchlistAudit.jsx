import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BeakerIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import audit from "../data/archetype_watchlist_audit.json";

/**
 * ArchetypeWatchlistAudit
 *
 * Retroactive grading of the Archetype Watchlist — every historical
 * pick where archetype said OVER but model said UNDER, graded against
 * the actual box score. Displays a narrative explaining why this exists
 * (came out of the Ohtani meeting question), how we're using it, and
 * lets viewers see which specific archetype signals are actually winning
 * over time.
 */
const MARKET_COLOR = {
  strikeouts: { bg: "bg-sky-500/10", border: "border-sky-500/30", text: "text-sky-300", label: "K" },
  walks: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-300", label: "BB" },
  hits: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-300", label: "H" },
};

const fmtSigned = (n, digits = 2) =>
  `${n >= 0 ? "+" : ""}${Number(n).toFixed(digits)}`;

function SignalRow({ name, stats }) {
  const w = stats.wins, l = stats.losses, n = stats.n, wr = stats.wr;
  const hot = wr >= 55;
  const cold = wr <= 45 && n >= 8;
  const tint = hot ? "text-emerald-400" : cold ? "text-rose-400" : "text-gray-300";
  const bgTint = hot
    ? "bg-emerald-500/5 border-emerald-500/20"
    : cold
      ? "bg-rose-500/5 border-rose-500/20"
      : "bg-gray-900/50 border-gray-800";
  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${bgTint}`}>
      <span className="text-xs text-gray-200">{name}</span>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] text-gray-500">n={n}</span>
        <span className="font-mono text-[11px] text-gray-400">
          {w}–{l}
        </span>
        <span className={`font-mono text-xs font-bold ${tint}`}>{wr.toFixed(1)}%</span>
      </div>
    </div>
  );
}

function DayBlock({ day }) {
  const [open, setOpen] = useState(false);
  const dateShort = day.date.slice(5).replace("-", "/");
  const wr = day.wins + day.losses > 0
    ? (day.wins / (day.wins + day.losses)) * 100 : 0;
  const winTint = day.wins > day.losses
    ? "bg-emerald-500/8 border-emerald-500/20"
    : day.losses > day.wins
      ? "bg-rose-500/8 border-rose-500/20"
      : "bg-gray-900/40 border-gray-800/60";

  return (
    <div className={`border rounded-lg overflow-hidden ${winTint}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          {open ? (
            <ChevronDownIcon className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500" />
          )}
          <span className="font-mono text-sm text-gray-300">{dateShort}</span>
          <span className="font-mono text-sm text-white font-semibold">
            <span className="text-emerald-400">{day.wins}</span>
            <span className="text-gray-600">–</span>
            <span className="text-rose-400">{day.losses}</span>
          </span>
          <span className="font-mono text-xs text-gray-500">{wr.toFixed(0)}%</span>
        </div>
        <span
          className={`font-mono text-xs font-bold ${
            day.profit >= 0 ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {fmtSigned(day.profit, 2)}
        </span>
      </button>
      <AnimatePresence>
        {open && day.picks?.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="divide-y divide-gray-900/50 bg-gray-950/40"
          >
            {day.picks.map((p, i) => {
              const c = MARKET_COLOR[p.market] || MARKET_COLOR.strikeouts;
              return (
                <div
                  key={i}
                  className="px-4 py-1.5 flex items-center gap-3 text-xs"
                >
                  <span
                    className={`font-mono font-bold text-[10px] w-6 text-center rounded ${c.bg} ${c.text}`}
                  >
                    {c.label}
                  </span>
                  <span className="flex-1 truncate text-white">{p.pitcher}</span>
                  <span className="font-mono text-gray-500 w-24 truncate">
                    {p.signal}
                  </span>
                  <span className="font-mono text-gray-400 w-12 text-right">
                    O{p.line}
                  </span>
                  <span className="font-mono text-gray-600 w-8 text-right">
                    {p.actual}
                  </span>
                  <span
                    className={`font-mono text-[10px] font-bold uppercase tracking-wider w-12 text-right ${
                      p.result === "WIN" ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {p.result}
                  </span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ArchetypeWatchlistAudit() {
  const t = audit.totals || {};
  const signals = audit.bySignal || {};
  const pitchers = audit.byPitcher || {};
  const days = audit.days || [];
  const bt = audit.backtestReference || {};

  const topPitchers = Object.entries(pitchers).slice(0, 10);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-16 border-t border-gray-900 relative"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <BeakerIcon className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Watchlist Audit
            </h2>
            <p className="text-xs uppercase tracking-widest text-amber-300">
              Archetype vs Model · Live Experiment
            </p>
          </div>
        </div>

        {/* The narrative — why this exists */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 mb-6 text-sm text-gray-300 leading-relaxed space-y-3">
          <p>
            <strong className="text-white">Why this exists.</strong> This came
            out of a meeting question on 4/22: <em className="text-gray-400">
              "Why is our model projecting one of the best strikeout pitchers ever
              — Shohei Ohtani, 33% career K% — to throw only 4 Ks when his line
              is 6.5? Shouldn't it recommend the over?"
            </em> It's a fair question, and the answer pointed at a real blind
            spot: the ML model reads recent usage (short post-TJ ramp-up
            outings) and projects more of the same. The archetype reads career
            talent. When the two disagree, the bettor deserves to see the
            disagreement.
          </p>
          <p>
            <strong className="text-white">What we do with it.</strong> We{" "}
            <em className="text-gray-400">don't</em> auto-publish these — the
            2024-2025 backtest on this exact slice was{" "}
            <span className="font-mono text-rose-400">
              {bt.n} picks, {bt.wr}% WR, {fmtSigned(bt.roi, 1)}% ROI
            </span>
            . Betting every archetype-model disagreement loses money in the
            aggregate. But specific sub-signals may be profitable, and{" "}
            <em className="text-gray-400">you</em> often have context the model
            can't see (a leash extension, a weather shift, a role change).
            So we surface these for manual review and grade every one.
          </p>
          <p>
            <strong className="text-white">The goal.</strong> Grow the sample
            day by day. If a specific signal (say "Post-TJ on BB lines" or
            "career K% ≥ 30%") stays above ~55% WR across 50+ picks, we
            promote it to an auto-published tier. If it stays below ~48%, we
            drop it. Until then, the disagreement is information — not a
            pick.
          </p>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatTile label="Graded" value={t.n || 0} />
          <StatTile
            label="Record"
            value={`${t.wins || 0}–${t.losses || 0}`}
            tint={(t.wins || 0) >= (t.losses || 0) ? "emerald" : "rose"}
          />
          <StatTile
            label="Win Rate"
            value={`${(t.wr || 0).toFixed(1)}%`}
            tint={(t.wr || 0) >= 50 ? "emerald" : "rose"}
          />
          <StatTile
            label="Hypothetical ROI"
            value={`${fmtSigned(t.roi || 0, 1)}%`}
            tint={(t.roi || 0) >= 0 ? "emerald" : "rose"}
            sub="if you'd bet all"
          />
        </div>

        {/* Two-column: by signal + by pitcher */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="bg-gray-900/40 border border-gray-800/60 rounded-xl p-4">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">By Signal</h3>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                Which archetype rules are working
              </span>
            </div>
            <div className="space-y-1.5">
              {Object.entries(signals).map(([name, stats]) => (
                <SignalRow key={name} name={name} stats={stats} />
              ))}
            </div>
            <p className="text-[10px] text-gray-600 mt-3 italic">
              Green = &gt;55% WR · Red = &lt;45% WR with n≥8 · small samples
              remain neutral until we have more data
            </p>
          </div>

          <div className="bg-gray-900/40 border border-gray-800/60 rounded-xl p-4">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">
                Top Pitchers
              </h3>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                Most-triggered · n≥2
              </span>
            </div>
            <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
              {topPitchers.map(([name, stats]) => (
                <SignalRow key={name} name={name} stats={stats} />
              ))}
            </div>
          </div>
        </div>

        {/* Day-by-day log */}
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-white">Daily Log</h3>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">
            {days.length} days · newest first · click to expand
          </span>
        </div>
        <div className="space-y-2">
          {days.map((d) => (
            <DayBlock key={d.date} day={d} />
          ))}
        </div>

        <p className="text-[10px] text-gray-600 text-center mt-8 italic">
          Watchlist results are <strong>experimental</strong> — graded as if
          wagered at −110 for illustration only. Not counted in the site's
          tracked record. Not a pick; not advice.
        </p>
      </div>
    </motion.section>
  );
}

function StatTile({ label, value, sub, tint = "gray" }) {
  const colors = {
    emerald: "border-emerald-500/30 from-emerald-500/10",
    rose: "border-rose-500/30 from-rose-500/10",
    gray: "border-gray-800 from-gray-800/10",
  };
  const valueTint = {
    emerald: "text-emerald-400",
    rose: "text-rose-400",
    gray: "text-white",
  };
  return (
    <div
      className={`relative rounded-xl border ${colors[tint]} bg-gradient-to-br to-transparent p-4 overflow-hidden`}
    >
      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className={`text-2xl font-bold font-mono ${valueTint[tint]}`}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-gray-600 mt-0.5">{sub}</p>}
    </div>
  );
}
