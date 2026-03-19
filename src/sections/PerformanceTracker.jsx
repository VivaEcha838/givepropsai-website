import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, Cell,
} from "recharts";
import {
  plHistory, tierPerformance, topNWinRate,
  holdoutSummary, forwardTestSummary, perSeasonResults,
  walkPlHistory, walkTierPerformance, walkTopNWinRate, walkHoldoutSummary, walkPerSeasonResults,
  hitsPlHistory, hitsTierPerformance, hitsTopNWinRate, hitsHoldoutSummary, hitsPerSeasonResults,
} from "../data/history";
import { BREAK_EVEN, PERFORMANCE, WALK_PERFORMANCE, HITS_PERFORMANCE } from "../data/constants";
import {
  CheckBadgeIcon, TrophyIcon, ArrowTrendingUpIcon,
  ChartBarIcon, BeakerIcon, ShieldCheckIcon,
} from "@heroicons/react/24/solid";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0]?.payload;
    const label = d?.n || d?.tier || d?.season || (d?.prediction ? `Prediction #${d.prediction}` : "");
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-gray-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="font-mono" style={{ color: p.color }}>
            {p.name}: {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
            {p.name === "Win Rate" ? "%" : ""}
          </p>
        ))}
        {d?.predictions && <p className="text-gray-500 font-mono">n = {d.predictions}</p>}
        {d?.correct !== undefined && d?.predictions && (
          <p className="text-gray-500 font-mono">{d.correct} / {d.predictions} correct</p>
        )}
      </div>
    );
  }
  return null;
};

function ModelSection({ title, accentHex, gradientId,
  plData, tierData, topNData, summary, perf, seasonCards }) {
  const lastPL = plData[plData.length - 1];

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6 mt-14">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <BeakerIcon className="w-5 h-5" style={{ color: accentHex }} />
          <h3 className="text-xl font-bold text-white">{title} &mdash; Walk-Forward</h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: `${accentHex}15`, borderColor: `${accentHex}30`, color: accentHex, borderWidth: 1 }}>{summary.season} OOS</span>
          <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-medium text-amber-400">Zero Leakage</span>
        </div>
        <p className="text-sm text-gray-500 sm:ml-8">
          Expanding window: {summary.folds > 1 ? `${summary.folds} folds` : "1 fold"} (train {summary.trainedOn}) &middot; {summary.totalPredictions.toLocaleString()} OOS predictions &middot; +{perf.profit}u edge
        </p>
      </motion.div>

      {/* Season Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`grid gap-4 mb-8 ${seasonCards.length === 1 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 sm:grid-cols-2"}`}>
        {seasonCards.map((s) => (
          <div key={s.season} className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Season {s.season}</p>
              <p className="text-lg font-bold text-white font-mono">{s.winRate}% Win Rate</p>
              <p className="text-xs text-gray-500">{s.predictions} predictions &middot; {s.correct} correct</p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-black font-mono ${s.profit > 0 ? "text-emerald-400" : "text-red-400"}`}>
                {s.profit > 0 ? "+" : ""}{s.profit}u
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14">
        {/* Top-N Accuracy */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5" style={{ color: accentHex }} />
              <h3 className="text-sm font-semibold text-white">{title} &mdash; Top-N Win Rate</h3>
            </div>
            <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-1 rounded">Higher confidence = higher win rate</span>
          </div>
          <p className="text-xs text-gray-500 mb-4">Across {summary.totalPredictions.toLocaleString()} OOS predictions.</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topNData} barSize={50}>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="n" tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis domain={[45, 75]} tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={BREAK_EVEN * 100} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Market-Implied (52.4%)", position: "insideTopRight", fill: "#ef4444", fontSize: 10 }} />
                <Bar dataKey="winRate" name="Win Rate" radius={[8, 8, 0, 0]}>
                  {topNData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-3 flex-wrap">
            {topNData.map((t) => (<span key={t.n} className="text-[10px] text-gray-500 font-mono">{t.n}: {t.winRate}% (n={t.predictions})</span>))}
          </div>
        </motion.div>

        {/* Accuracy by Tier */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrophyIcon className="w-5 h-5" style={{ color: accentHex }} />
            <h3 className="text-sm font-semibold text-white">{title} &mdash; Win Rate by Tier</h3>
          </div>
          <p className="text-xs text-gray-500 mb-3">All tiers above market-implied (52.4%).</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tierData} barSize={60}>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="tier" tick={{ fill: "#6b7280", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis domain={[48, 70]} tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={BREAK_EVEN * 100} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "MI", position: "right", fill: "#ef4444", fontSize: 10 }} />
                <Bar dataKey="winRate" name="Win Rate" radius={[6, 6, 0, 0]}>
                  {tierData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2 flex-wrap">
            {tierData.map((t) => (<span key={t.tier} className="text-[10px] text-gray-500 font-mono">{t.tier}: {t.correct}/{t.predictions}</span>))}
          </div>
        </motion.div>

        {/* Cumulative P/L */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ArrowTrendingUpIcon className="w-5 h-5" style={{ color: accentHex }} />
              <h3 className="text-sm font-semibold text-white">{title} &mdash; Cumulative Edge</h3>
            </div>
            <span className="text-sm font-mono font-bold" style={{ color: accentHex }}>+{lastPL.cumPL}u</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={plData}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={accentHex} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={accentHex} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="prediction" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#374151" />
                <Area type="monotone" dataKey="cumPL" name="Edge (units)" stroke={accentHex} strokeWidth={2} fill={`url(#${gradientId})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-gray-600 mt-2 text-center">
            Walk-forward trajectory: {summary.totalPredictions.toLocaleString()} OOS predictions ({summary.season})
          </p>
        </motion.div>
      </div>
    </>
  );
}

export default function PerformanceTracker() {
  return (
    <section id="performance" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-1">Performance</h2>
          <p className="text-gray-400">Three models, walk-forward validation with zero data leakage + live forward test</p>
        </motion.div>

        {/* Forward Test Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <CheckBadgeIcon className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-lg font-bold text-white">2026 Spring Training Forward Test</h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Live</span>
              </div>
              <p className="text-sm text-gray-400">
                {forwardTestSummary.correct}/{forwardTestSummary.totalPredictions} correct on genuinely unseen 2026 data ({forwardTestSummary.period}).
                Lines estimated from model (real odds feed coming soon).
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-3xl font-black font-mono text-emerald-400">+{forwardTestSummary.profit}u</p>
              <p className="text-xs text-gray-500">{(forwardTestSummary.winRate * 100).toFixed(1)}% win rate</p>
            </div>
          </div>
        </motion.div>

        {/* ═══ STRIKEOUT MODEL ═══ */}
        <ModelSection
          title="Strikeout Model"
          accentHex="#f59e0b"
          gradientId="kPlGrad"
          plData={plHistory}
          tierData={tierPerformance}
          topNData={topNWinRate}
          summary={holdoutSummary}
          perf={PERFORMANCE.walkForward}
          seasonCards={perSeasonResults}
        />

        {/* ═══ WALK MODEL ═══ */}
        <ModelSection
          title="Walk Model"
          accentHex="#06b6d4"
          gradientId="walkPlGrad"
          plData={walkPlHistory}
          tierData={walkTierPerformance}
          topNData={walkTopNWinRate}
          summary={walkHoldoutSummary}
          perf={WALK_PERFORMANCE.walkForward}
          seasonCards={walkPerSeasonResults}
        />

        {/* ═══ HITS ALLOWED MODEL ═══ */}
        <ModelSection
          title="Hits Allowed Model"
          accentHex="#f43f5e"
          gradientId="hitsPlGrad"
          plData={hitsPlHistory}
          tierData={hitsTierPerformance}
          topNData={hitsTopNWinRate}
          summary={hitsHoldoutSummary}
          perf={HITS_PERFORMANCE.walkForward}
          seasonCards={hitsPerSeasonResults}
        />

        {/* Methodology Note */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Methodology Transparency</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-500">
                <div>
                  <p className="text-gray-400 font-medium mb-1">Walk-Forward Validation</p>
                  <p>Expanding window: all 3 models use rolling monthly folds (test 2024 + 2025). All league stats recomputed per fold from training data only. Zero leakage.</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium mb-1">Strategy Optimizer</p>
                  <p>Inner 3-fold TimeSeriesSplit of the calibrator to get OOF p_win. Grid search over (p_win_thresh, require_agree, min_edge) with Sharpe-like scoring. Filters learned from training only.</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium mb-1">Homogeneous Architecture</p>
                  <p>All 3 models use the same 4-stage pipeline: Model B (quantile XGBoost) &rarr; Model A (residual) &rarr; Calibrator (XGB classifier) &rarr; Strategy Optimizer. Same flow, different features.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
