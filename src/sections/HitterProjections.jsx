import { useState } from "react";
import { motion } from "framer-motion";
import { ChartBarIcon, BoltIcon } from "@heroicons/react/24/solid";
import hitsPicks from "../data/hitter_hits_picks.json";
import sbPicks from "../data/hitter_sb_picks.json";

/**
 * Hitter DFS Projections — internal site only.
 *
 * Two distinct projection sets, both DFS-framed (no betting odds, no
 * book pricing in the headline):
 *   1. HITS — top batters by predicted hits in tonight's lineup
 *   2. STOLEN BASES — top batters by predicted SB lambda
 *
 * Source data: MLB-Hitter-Props/predictions/{picks_<date>,picks_sb_dfs_<date>}.json
 * copied at deploy-time into src/data/hitter_*.json. Eventually a daily
 * cron should refresh these alongside live_data.js.
 */

const TABS = [
  { key: "hits", label: "Hits Projections",       icon: ChartBarIcon },
  { key: "sb",   label: "Stolen Base Projections", icon: BoltIcon    },
];

function StatCell({ value, suffix = "", highlight = false, fmt = (v) => v }) {
  return (
    <td className={`px-3 py-2.5 text-right font-mono text-sm ${
      highlight ? "text-amber-300 font-semibold" : "text-gray-200"
    }`}>
      {fmt(value)}{suffix}
    </td>
  );
}

// Format an American-odds price with sign + dash placeholder when null.
function fmtPrice(p) {
  if (p == null || isNaN(p)) return "—";
  const n = Math.round(p);
  return n > 0 ? `+${n}` : `${n}`;
}

// Render a per-book price cell. Highlights when this book IS the best
// book (i.e. its price equals best_price), so the user can see at a glance
// where the best line is.
function PriceCell({ value, isBest }) {
  if (value == null) return <td className="px-2 py-2.5 text-right font-mono text-xs text-gray-600">—</td>;
  return (
    <td className={`px-2 py-2.5 text-right font-mono text-xs ${
      isBest ? "text-amber-300 font-semibold" : "text-gray-300"
    }`}>
      {fmtPrice(value)}
    </td>
  );
}

function HitsTable() {
  const rows = hitsPicks || [];
  if (!rows.length) {
    return (
      <div className="text-center py-12 text-gray-500 text-sm">
        No hits projections published yet — will populate once tonight's lineups post.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-[10px] uppercase tracking-wider text-gray-500">
            <th className="px-3 py-2 text-left font-semibold">Rank</th>
            <th className="px-3 py-2 text-left font-semibold">Batter</th>
            <th className="px-3 py-2 text-center font-semibold">Order</th>
            <th className="px-3 py-2 text-left font-semibold">Opp Pitcher</th>
            <th className="px-3 py-2 text-center font-semibold">Side</th>
            <th className="px-3 py-2 text-right font-semibold">Pred Hits</th>
            <th className="px-3 py-2 text-right font-semibold">Edge</th>
            <th className="px-3 py-2 text-right font-semibold">Best (US)</th>
            <th className="px-2 py-2 text-right font-semibold">DK</th>
            <th className="px-2 py-2 text-right font-semibold">FD</th>
            <th className="px-2 py-2 text-right font-semibold">MGM</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => {
            const bestBook = (p.best_book || "").toLowerCase();
            return (
              <tr key={`${p.batterName}-${i}`}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="px-3 py-2.5 text-left font-mono text-amber-400 font-semibold">
                  {i + 1}
                </td>
                <td className="px-3 py-2.5 text-left font-medium text-white">
                  {p.batterName}
                </td>
                <td className="px-3 py-2.5 text-center text-gray-400 font-mono">
                  {p.lineup_spot}
                </td>
                <td className="px-3 py-2.5 text-left text-gray-300 text-xs">
                  {p.opp_starter}
                </td>
                <td className="px-3 py-2.5 text-center text-xs">
                  <span className={`px-2 py-0.5 rounded font-semibold ${
                    p.side === "Over"
                      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                  }`}>
                    {p.side} {p.line}
                  </span>
                </td>
                <StatCell value={p.pred_hits?.toFixed(2)} highlight />
                <td className={`px-3 py-2.5 text-right font-mono text-sm ${
                  p.edge > 0 ? "text-emerald-300" : "text-rose-300"
                }`}>
                  {p.edge > 0 ? "+" : ""}{p.edge?.toFixed(2)}
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-sm">
                  <span className="text-amber-300 font-semibold">{fmtPrice(p.best_price)}</span>
                  {" "}
                  <span className="text-gray-500 text-[10px]">{p.best_book}</span>
                </td>
                <PriceCell value={p.dk_price}  isBest={bestBook === "draftkings"} />
                <PriceCell value={p.fd_price}  isBest={bestBook === "fanduel"} />
                <PriceCell value={p.mgm_price} isBest={bestBook === "betmgm"} />
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-gray-500 italic">
        Hits projections are <span className="text-amber-300">DFS-primary</span> on the
        major US books (DraftKings, FanDuel, BetMGM) where prices typically
        run -200 to -500 (juice trap). Soft books like BetRivers and Fanatics
        sometimes offer the same prop at +100 to +180 — when they do, that's
        the only real betting edge. The "Best (US)" column shows the best
        US-book price; DK / FD / MGM columns show what the major books quote
        for the same prop. Highlight = book matches the best price. A wide
        gap between Best and DK/FD means the edge only exists at the soft
        book.
      </p>
    </div>
  );
}

function SbTable() {
  const rows = sbPicks || [];
  if (!rows.length) {
    return (
      <div className="text-center py-12 text-gray-500 text-sm">
        No SB projections published yet — will populate once tonight's lineups post.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-[10px] uppercase tracking-wider text-gray-500">
            <th className="px-3 py-2 text-left font-semibold">Rank</th>
            <th className="px-3 py-2 text-left font-semibold">Batter</th>
            <th className="px-3 py-2 text-center font-semibold">Order</th>
            <th className="px-3 py-2 text-left font-semibold">Matchup</th>
            <th className="px-3 py-2 text-right font-semibold">λ (exp SBs)</th>
            <th className="px-3 py-2 text-right font-semibold">P(SB ≥ 1)</th>
            <th className="px-3 py-2 text-right font-semibold">DK pts (×5)</th>
            <th className="px-3 py-2 text-right font-semibold">Sprint</th>
            <th className="px-3 py-2 text-right font-semibold">Time Edge</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => {
            const tooltip =
              `Battery time to 2B vs runner time to 2B. Positive = runner has buffer, ` +
              `negative = caught-stealing risk. Driven by sprint speed + opposing pitcher's ` +
              `lead allowance + opposing catcher's pop time.`;
            return (
              <tr key={`${p.batterName}-${i}`}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="px-3 py-2.5 text-left font-mono text-amber-400 font-semibold">
                  {p.rank ?? i + 1}
                </td>
                <td className="px-3 py-2.5 text-left font-medium text-white">
                  {p.batterName}
                </td>
                <td className="px-3 py-2.5 text-center text-gray-400 font-mono">
                  {p.lineup_spot}
                </td>
                <td className="px-3 py-2.5 text-left text-gray-300">
                  {p.team} {p.is_home ? "vs" : "@"} {p.opp_team}
                  <span className="text-gray-500"> · {p.opp_starter}</span>
                </td>
                <StatCell value={p.pred_lambda?.toFixed(3)} highlight />
                <StatCell value={p.pred_p_sb_ge1?.toFixed(1)} suffix="%" />
                <StatCell value={p.pred_dk_pts?.toFixed(2)} />
                <StatCell value={p.sprint_speed?.toFixed(1)} suffix=" ft/s" />
                <td className="px-3 py-2.5 text-right font-mono text-sm" title={tooltip}>
                  <span className={p.time_advantage_sec > 0 ? "text-emerald-300" : "text-rose-300"}>
                    {p.time_advantage_sec > 0 ? "+" : ""}{p.time_advantage_sec?.toFixed(2)}s
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-gray-500 italic">
        SB projections are <span className="text-amber-300">DFS-primary, betting-selective</span>.
        Top-3 picks historically hit P(SB≥1) at <span className="text-emerald-300">~27%</span> vs
        slate average of <span className="text-gray-400">~10%</span> (a 2.8× lift). DK fantasy
        scoring awards 5 pts per SB. For betting, only consider these picks at book prices ≥ <span className="text-emerald-300">+267</span>;
        most days that filter produces 0 publishable bets — the model is a DFS
        differentiator first, a selective betting tool second. λ (lambda) is the model's
        Poisson expected SB count for the game.
      </p>
    </div>
  );
}

export default function HitterProjections() {
  const [tab, setTab] = useState("hits");

  const totalHits = hitsPicks?.length ?? 0;
  const totalSb = sbPicks?.length ?? 0;

  return (
    <section id="hitter-projections" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-1">
            Hitter Projections — DFS
          </h2>
          <p className="text-gray-400 text-sm mb-1">
            Per-batter projection set for tonight's slate. <span className="text-amber-300">DFS-framed</span>:
            ranked by expected fantasy production, not by book mispricing.
          </p>
          <p className="text-xs text-gray-600 italic">
            Sub-product of the Hitter Props research repo. Powers DraftKings DFS, FanDuel DFS,
            PrizePicks, Underdog Fantasy lineup construction. Hits market is permanently DFS-only;
            SB market is DFS-primary with selective betting at +money tail prices.
          </p>
        </motion.div>

        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            const count = t.key === "hits" ? totalHits : totalSb;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  active
                    ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                    : "bg-gray-900/50 text-gray-400 border border-gray-800 hover:text-gray-200 hover:border-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
                {count > 0 && (
                  <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                    active ? "bg-amber-500/20 text-amber-200" : "bg-gray-800 text-gray-500"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 sm:p-6">
          {tab === "hits" ? <HitsTable /> : <SbTable />}
        </div>
      </div>
    </section>
  );
}
