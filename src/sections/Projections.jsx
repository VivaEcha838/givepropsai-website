import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChartBarIcon, ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import { todayProjections, lastUpdated } from "../data/live_data";

// DFS-framed projections page. No PICK / BET / EDGE language — just the
// model's per-pitcher K / H / BB projections for the day. Sortable by any
// column. Internal-site only for now (consumer site receives [] and the
// page renders nothing).

const COLS = [
  { key: "pitcherName", label: "Pitcher",   align: "left",  width: "min-w-[160px]" },
  { key: "matchup",     label: "Matchup",   align: "left",  width: "min-w-[110px]" },
  { key: "K",           label: "Proj K",    align: "right", width: "w-[80px]" },
  { key: "H",           label: "Proj H",    align: "right", width: "w-[80px]" },
  { key: "BB",          label: "Proj BB",   align: "right", width: "w-[80px]" },
  { key: "kArch",       label: "K Profile", align: "left",  width: "min-w-[140px]" },
  { key: "bbArch",      label: "BB Profile", align: "left", width: "min-w-[140px]" },
];

const K_ARCH_LABEL = {
  POWER: { label: "Power", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  AVERAGE_K: { label: "Avg K", color: "text-gray-300 bg-gray-700/40 border-gray-600/40" },
  CONTACT: { label: "Contact", color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30" },
  UNKNOWN: { label: "—", color: "text-gray-500" },
};
const BB_ARCH_LABEL = {
  ELITE_CMD: { label: "Elite Cmd", color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30" },
  CONTROL: { label: "Control", color: "text-emerald-200 bg-emerald-500/5 border-emerald-500/20" },
  AVERAGE_BB: { label: "Avg BB", color: "text-gray-300 bg-gray-700/40 border-gray-600/40" },
  VOLATILE: { label: "Volatile", color: "text-rose-300 bg-rose-500/10 border-rose-500/30" },
  WILD_EFFECTIVE: { label: "Wild-Eff", color: "text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/30" },
  UNKNOWN: { label: "—", color: "text-gray-500" },
};

function archChip(arch, mapping) {
  const m = mapping[arch] || mapping.UNKNOWN;
  if (m.label === "—") return <span className="text-gray-600">—</span>;
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${m.color}`}>
      {m.label}
    </span>
  );
}

function getSortValue(row, key) {
  if (key === "pitcherName") return row.pitcherName.toLowerCase();
  if (key === "matchup") return `${row.pitcherTeam}-${row.oppTeam}`;
  if (key === "K" || key === "H" || key === "BB") return row.projections?.[key] ?? -1;
  if (key === "kArch") return row.archetype?.k ?? "";
  if (key === "bbArch") return row.archetype?.bb ?? "";
  return "";
}

export default function Projections() {
  const [sortKey, setSortKey] = useState("K");
  const [sortDir, setSortDir] = useState("desc"); // K is numeric — desc default

  const sorted = useMemo(() => {
    const rows = [...(todayProjections || [])];
    rows.sort((a, b) => {
      const va = getSortValue(a, sortKey);
      const vb = getSortValue(b, sortKey);
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [sortKey, sortDir]);

  const headerClick = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      // Numeric columns default desc, text columns default asc
      setSortDir(["K", "H", "BB"].includes(key) ? "desc" : "asc");
    }
  };

  if (!todayProjections || todayProjections.length === 0) {
    return (
      <section id="projections" className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          No projections available yet for {lastUpdated}.
        </div>
      </section>
    );
  }

  return (
    <section id="projections" className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
            <ChartBarIcon className="w-3.5 h-3.5" />
            Daily Pitcher Projections
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
            Today's slate, ranked
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            Model projections for every starter on today's slate. Sort by any column.
            These are raw model outputs — interpret as you see fit.
          </p>
          <p className="text-[11px] text-gray-600 mt-2">
            {sorted.length} pitchers · {lastUpdated}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-900/60 border border-gray-800/50 rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-950/60 border-b border-gray-800/50">
                  {COLS.map((c) => (
                    <th
                      key={c.key}
                      onClick={() => headerClick(c.key)}
                      className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 cursor-pointer hover:text-cyan-400 select-none ${c.width} text-${c.align}`}
                    >
                      <span className="inline-flex items-center gap-1">
                        {c.label}
                        {sortKey === c.key && (
                          <ArrowsUpDownIcon className="w-3 h-3 text-cyan-400" />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/30">
                {sorted.map((row, i) => (
                  <tr key={`${row.pitcherName}-${row.oppTeam}-${i}`} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-3 py-2.5 text-white font-semibold">
                      {row.pitcherName}
                      <div className="text-[10px] text-gray-500 font-normal">{row.pitcherTeam}</div>
                    </td>
                    <td className="px-3 py-2.5 text-gray-300 text-xs">
                      {row.isHome ? "vs" : "@"} {row.oppTeam}
                      <div className="text-[10px] text-gray-500">{row.isHome ? "Home" : "Away"}</div>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-amber-300 font-semibold">
                      {row.projections?.K?.toFixed(1) ?? "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-violet-300 font-semibold">
                      {row.projections?.H?.toFixed(1) ?? "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-emerald-300 font-semibold">
                      {row.projections?.BB?.toFixed(1) ?? "—"}
                    </td>
                    <td className="px-3 py-2.5">
                      {archChip(row.archetype?.k, K_ARCH_LABEL)}
                      {row.archetype?.kPct != null && (
                        <span className="ml-1.5 text-[10px] text-gray-500 font-mono">
                          {row.archetype.kPct.toFixed(0)}%
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      {archChip(row.archetype?.bb, BB_ARCH_LABEL)}
                      {row.archetype?.bbPct != null && (
                        <span className="ml-1.5 text-[10px] text-gray-500 font-mono">
                          {row.archetype.bbPct.toFixed(0)}%
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-950/40 border-t border-gray-800/30">
            <p className="text-[11px] text-gray-500">
              <strong className="text-gray-400">DFS framing:</strong> these are model-projected per-game
              totals (K = strikeouts, H = hits allowed, BB = walks). Profile labels reflect career
              tendencies, not today's matchup specifically. Use as one input among many.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
