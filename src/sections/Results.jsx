import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import results from "../data/_results.json";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrophyIcon,
  ChartBarSquareIcon,
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

const MARKET_LABEL = {
  strikeouts: "K",
  walks: "BB",
  hits: "H",
};
const MARKET_FULL = {
  strikeouts: "Strikeouts",
  walks: "Walks",
  hits: "Hits Allowed",
};
const MARKET_COLOR = {
  strikeouts: "text-amber-400",
  walks: "text-cyan-400",
  hits: "text-rose-400",
};

function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatPrice(p) {
  if (p == null) return "—";
  return p > 0 ? `+${Math.round(p)}` : `${Math.round(p)}`;
}

function statusIcon(status) {
  if (status === "win")
    return <CheckCircleIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
  if (status === "loss")
    return <XCircleIcon className="w-4 h-4 text-red-400 flex-shrink-0" />;
  return <ClockIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />;
}

function statusLabel(status) {
  if (status === "win") return "WIN";
  if (status === "loss") return "LOSS";
  return "PENDING";
}

function statusColor(status) {
  if (status === "win") return "text-emerald-400";
  if (status === "loss") return "text-red-400";
  return "text-gray-500";
}

export default function Results() {
  const [marketFilter, setMarketFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sharpOnly, setSharpOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("daily"); // "daily" or "all"

  // Flatten all picks across all days for "all bets" view
  const allBets = useMemo(() => {
    const rows = [];
    results.days.forEach((day) => {
      day.picks.forEach((p) => {
        rows.push({ ...p, date: day.date });
      });
    });
    return rows;
  }, []);

  // Apply filters
  const filteredBets = useMemo(() => {
    return allBets.filter((b) => {
      if (marketFilter !== "all" && b.market !== marketFilter) return false;
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (sharpOnly && !b.hcFlag) return false;
      if (search && !b.pitcher.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [allBets, marketFilter, statusFilter, sharpOnly, search]);

  const filteredDays = useMemo(() => {
    if (marketFilter === "all" && statusFilter === "all" && !search && !sharpOnly) {
      return results.days;
    }
    return results.days
      .map((d) => ({
        ...d,
        picks: d.picks.filter((p) => {
          if (marketFilter !== "all" && p.market !== marketFilter) return false;
          if (statusFilter !== "all" && p.status !== statusFilter) return false;
          if (sharpOnly && !p.hcFlag) return false;
          if (
            search &&
            !p.pitcher.toLowerCase().includes(search.toLowerCase())
          )
            return false;
          return true;
        }),
      }))
      .filter((d) => d.picks.length > 0);
  }, [marketFilter, statusFilter, sharpOnly, search]);

  const totals = results.totals;
  const updated = new Date(results.updatedAt);

  // Compute filtered summary
  const filteredSummary = useMemo(() => {
    let wins = 0,
      losses = 0,
      pending = 0,
      profit = 0;
    filteredBets.forEach((b) => {
      if (b.status === "win") {
        wins++;
        profit += b.profit || 0;
      } else if (b.status === "loss") {
        losses++;
        profit += b.profit || 0;
      } else {
        pending++;
      }
    });
    const graded = wins + losses;
    return {
      wins,
      losses,
      pending,
      profit: Math.round(profit * 100) / 100,
      wr: graded ? (wins / graded) * 100 : 0,
      roi: graded ? (profit / (graded * 100)) * 100 : 0,
    };
  }, [filteredBets]);

  const filtersActive =
    marketFilter !== "all" || statusFilter !== "all" || search !== "" || sharpOnly;

  return (
    <section id="results" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
            <ChartBarSquareIcon className="w-3.5 h-3.5" />
            Live Forward Test &middot; Verified Daily &middot; Timestamped
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">Results</h2>
          <p className="text-sm text-gray-400 mt-2 max-w-2xl mx-auto">
            Every pick ever published &mdash; win, loss, or pending &mdash;
            logged here automatically each night after the final box scores post.
            Nothing hidden. Nothing reshuffled.
          </p>
          <p className="text-[10px] text-gray-600 mt-1">
            Last updated{" "}
            {updated.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </motion.div>

        {/* Overall Totals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          <StatCard
            label="Overall Record"
            value={`${totals.wins}–${totals.losses}`}
            sub={`${totals.totalPicks} graded bets`}
            icon={<TrophyIcon className="w-4 h-4 text-amber-400" />}
          />
          <StatCard
            label="Win Rate"
            value={`${totals.winRate}%`}
            sub="52.4% break-even"
            color="text-emerald-400"
          />
          <StatCard
            label="P/L (flat $100)"
            value={
              totals.profit >= 0
                ? `+$${totals.profit.toLocaleString()}`
                : `-$${Math.abs(totals.profit).toLocaleString()}`
            }
            color={totals.profit >= 0 ? "text-emerald-400" : "text-red-400"}
            sub="cumulative"
          />
          <StatCard
            label="ROI"
            value={
              totals.roi >= 0
                ? `+${totals.roi.toFixed(1)}%`
                : `${totals.roi.toFixed(1)}%`
            }
            sub="per bet"
            icon={<ArrowTrendingUpIcon className="w-4 h-4 text-emerald-400" />}
            color={totals.roi >= 0 ? "text-emerald-400" : "text-red-400"}
          />
        </motion.div>

        {/* By-market breakdown */}
        {results.byMarket && Object.keys(results.byMarket).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
          >
            {Object.entries(results.byMarket).map(([mkt, stats]) => (
              <div
                key={mkt}
                className="bg-gray-900/60 border border-gray-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${MARKET_COLOR[mkt]}`}
                  >
                    {MARKET_FULL[mkt]}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold ${
                      stats.profit >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {stats.profit >= 0 ? "+" : ""}${stats.profit.toFixed(0)}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black font-mono text-white">
                    {stats.winRate}%
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    {stats.wins}–{stats.losses}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Sharp Plays — high-confidence subset (⭐ flagged picks only) */}
        {results.sharp && results.sharp.totalPicks > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-lg">⭐</span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Sharp Plays
                  </h3>
                  <span className="text-[10px] text-amber-400/70 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    conf ≥ {results.sharp.threshold}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Highest-conviction subset · tracked alongside overall record
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <SharpStat
                  label="Record"
                  value={`${results.sharp.wins}–${results.sharp.losses}`}
                  sub={`${results.sharp.totalPicks} picks`}
                />
                <SharpStat
                  label="Win Rate"
                  value={`${results.sharp.winRate}%`}
                  sub="vs 52.4% break-even"
                  color="text-emerald-400"
                />
                <SharpStat
                  label="P/L"
                  value={
                    results.sharp.profit >= 0
                      ? `+$${results.sharp.profit.toLocaleString()}`
                      : `-$${Math.abs(results.sharp.profit).toLocaleString()}`
                  }
                  color={
                    results.sharp.profit >= 0 ? "text-emerald-400" : "text-red-400"
                  }
                  sub="flat $100"
                />
                <SharpStat
                  label="ROI"
                  value={
                    results.sharp.roi >= 0
                      ? `+${results.sharp.roi.toFixed(1)}%`
                      : `${results.sharp.roi.toFixed(1)}%`
                  }
                  color={
                    results.sharp.roi >= 0 ? "text-emerald-400" : "text-red-400"
                  }
                  sub="per pick"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* View toggle + filters */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* View toggle */}
            <div className="inline-flex rounded-lg bg-gray-800/60 p-1">
              <button
                onClick={() => setView("daily")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  view === "daily"
                    ? "bg-amber-500/20 text-amber-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Day-by-Day
              </button>
              <button
                onClick={() => setView("all")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  view === "all"
                    ? "bg-amber-500/20 text-amber-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Full Bet History
              </button>
            </div>

            {/* Market filter */}
            <select
              value={marketFilter}
              onChange={(e) => setMarketFilter(e.target.value)}
              className="bg-gray-800/60 border border-gray-700 rounded-lg text-xs text-white px-2 py-1.5"
            >
              <option value="all">All markets</option>
              <option value="strikeouts">Strikeouts</option>
              <option value="walks">Walks</option>
              <option value="hits">Hits Allowed</option>
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-800/60 border border-gray-700 rounded-lg text-xs text-white px-2 py-1.5"
            >
              <option value="all">All statuses</option>
              <option value="win">Wins only</option>
              <option value="loss">Losses only</option>
              <option value="pending">Pending only</option>
            </select>

            {/* ⭐ Sharp toggle */}
            <button
              onClick={() => setSharpOnly(!sharpOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                sharpOnly
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-gray-800/60 text-gray-400 border-gray-700 hover:text-amber-300"
              }`}
              title="Filter to Sharp Plays (model confidence ≥ 0.65)"
            >
              ⭐ Sharp Plays {sharpOnly ? "on" : ""}
            </button>

            {/* Search */}
            <div className="flex-1 min-w-[180px] relative">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pitcher…"
                className="w-full pl-8 pr-3 py-1.5 bg-gray-800/60 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500"
              />
            </div>

            {filtersActive && (
              <button
                onClick={() => {
                  setMarketFilter("all");
                  setStatusFilter("all");
                  setSharpOnly(false);
                  setSearch("");
                }}
                className="text-xs text-gray-400 hover:text-white"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Filtered summary (only when filters active) */}
          {filtersActive && (
            <div className="mt-3 pt-3 border-t border-gray-800 flex flex-wrap gap-4 text-xs text-gray-400">
              <span>
                <span className="text-white font-semibold">
                  {filteredBets.length}
                </span>{" "}
                bets match
              </span>
              <span>
                Record:{" "}
                <span className="text-white font-mono font-semibold">
                  {filteredSummary.wins}–{filteredSummary.losses}
                  {filteredSummary.pending > 0 && (
                    <span className="text-gray-500">
                      {" "}
                      · {filteredSummary.pending}P
                    </span>
                  )}
                </span>
              </span>
              {filteredSummary.wins + filteredSummary.losses > 0 && (
                <>
                  <span>
                    WR:{" "}
                    <span className="text-emerald-400 font-mono font-semibold">
                      {filteredSummary.wr.toFixed(1)}%
                    </span>
                  </span>
                  <span>
                    P/L:{" "}
                    <span
                      className={`font-mono font-semibold ${
                        filteredSummary.profit >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {filteredSummary.profit >= 0 ? "+" : ""}$
                      {filteredSummary.profit.toFixed(2)}
                    </span>
                  </span>
                  <span>
                    ROI:{" "}
                    <span
                      className={`font-mono font-semibold ${
                        filteredSummary.roi >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {filteredSummary.roi >= 0 ? "+" : ""}
                      {filteredSummary.roi.toFixed(1)}%
                    </span>
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* DAY-BY-DAY VIEW */}
        {view === "daily" && (
          <div className="space-y-3">
            {filteredDays.map((day, idx) => {
              const graded = day.wins + day.losses;
              const dayRoi = graded > 0 ? (day.profit / (graded * 100)) * 100 : 0;
              return (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(idx * 0.02, 0.2) }}
                  className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden"
                >
                  {/* Day header */}
                  <div className="px-4 py-3 bg-gray-800/40 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-white font-mono">
                        {formatDate(day.date)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {day.picks.length}{" "}
                        {day.picks.length === 1 ? "pick" : "picks"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-mono text-white">
                        {day.wins}–{day.losses}
                        {day.pending > 0 && (
                          <span className="text-gray-500">
                            {" "}
                            · {day.pending}P
                          </span>
                        )}
                      </span>
                      <span
                        className={`font-mono font-bold min-w-[80px] text-right ${
                          day.profit >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {day.profit >= 0 ? "+" : ""}${day.profit.toFixed(2)}
                      </span>
                      {graded > 0 && (
                        <span
                          className={`font-mono text-xs hidden sm:inline min-w-[60px] text-right ${
                            dayRoi >= 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {dayRoi >= 0 ? "+" : ""}
                          {dayRoi.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* All picks, always expanded */}
                  <div className="divide-y divide-gray-800/70">
                    {day.picks.map((p, i) => (
                      <BetRow key={i} pick={p} />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* FULL BET HISTORY VIEW */}
        {view === "all" && (
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-800/40 border-b border-gray-800 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">
                Full Bet History
              </span>
              <span className="text-xs text-gray-500">
                {filteredBets.length} bets
              </span>
            </div>
            <div className="divide-y divide-gray-800/70 max-h-[800px] overflow-y-auto">
              {filteredBets.length === 0 && (
                <div className="py-8 text-center text-sm text-gray-500">
                  No bets match current filters.
                </div>
              )}
              {filteredBets.map((p, i) => (
                <BetRow key={i} pick={p} showDate={true} />
              ))}
            </div>
          </div>
        )}

        {/* Footer note */}
        <p className="text-[10px] text-gray-600 text-center mt-8 max-w-2xl mx-auto">
          Every pick is published to a public, timestamped log before first pitch.
          Results auto-import from MLB box scores the night each game finishes.
          Full history retained permanently &mdash; no retroactive edits.
        </p>
      </div>
    </section>
  );
}

function BetRow({ pick, showDate = false }) {
  return (
    <div className="px-4 py-2.5 flex items-center gap-3 text-xs hover:bg-gray-800/30 transition-colors">
      {statusIcon(pick.status)}
      {showDate && (
        <span className="text-gray-500 font-mono w-20 flex-shrink-0">
          {formatDate(pick.date)}
        </span>
      )}
      <span
        className={`font-mono font-bold w-8 flex-shrink-0 ${MARKET_COLOR[pick.market]}`}
      >
        {MARKET_LABEL[pick.market] || pick.market}
      </span>
      <span className="text-white font-semibold flex-1 truncate min-w-0 flex items-center gap-1.5">
        {pick.pitcher}
        {pick.hcFlag && (
          <span
            title="Sharp Play — model confidence ≥ 0.65"
            className="text-amber-400 text-[10px] flex-shrink-0"
          >
            ⭐
          </span>
        )}
      </span>
      <span className="text-gray-400 font-mono hidden sm:inline flex-shrink-0">
        U{pick.line}
      </span>
      <span className="text-gray-500 font-mono w-14 text-right flex-shrink-0">
        {formatPrice(pick.price)}
      </span>
      <span className="text-gray-500 font-mono w-16 text-right hidden md:inline flex-shrink-0">
        actual {pick.actual != null ? pick.actual : "—"}
      </span>
      <span
        className={`font-mono text-[10px] font-bold uppercase tracking-wider w-16 text-right flex-shrink-0 ${statusColor(
          pick.status,
        )}`}
      >
        {statusLabel(pick.status)}
      </span>
      <span
        className={`font-mono font-bold w-20 text-right flex-shrink-0 ${
          pick.status === "pending"
            ? "text-gray-500"
            : pick.profit >= 0
            ? "text-emerald-400"
            : "text-red-400"
        }`}
      >
        {pick.status === "pending"
          ? "—"
          : `${pick.profit >= 0 ? "+" : ""}$${pick.profit.toFixed(2)}`}
      </span>
    </div>
  );
}

function SharpStat({ label, value, sub, color = "text-white" }) {
  return (
    <div>
      <p className="text-[10px] text-amber-400/70 uppercase tracking-wider font-semibold mb-1">
        {label}
      </p>
      <p className={`text-xl md:text-2xl font-black font-mono ${color}`}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function StatCard({ label, value, sub, color = "text-white", icon }) {
  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
          {label}
        </span>
        {icon}
      </div>
      <p className={`text-2xl md:text-3xl font-black font-mono ${color}`}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}
