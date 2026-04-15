import { motion } from "framer-motion";
import {
  ArrowTrendingUpIcon,
  CalculatorIcon,
  ShieldCheckIcon,
  ChartBarSquareIcon,
} from "@heroicons/react/24/solid";
import { season2026, dailyResults, lastUpdated } from "../data/live_data";

function DayRow({ day }) {
  const sign = day.pl >= 0 ? "+" : "";
  const signR = day.runningPl >= 0 ? "+" : "";
  const wl = `${day.wins}-${day.losses}`;
  const dateShort = day.date.slice(5).replace("-", "/");
  const total = day.wins + day.losses;
  const wr = total > 0 ? ((day.wins / total) * 100).toFixed(0) : "-";
  return (
    <tr className="border-t border-gray-800 hover:bg-gray-800/30 transition-colors">
      <td className="py-2 px-3 text-xs text-gray-400 font-mono">{dateShort}</td>
      <td className="py-2 px-3 text-xs text-white font-mono">{wl}</td>
      <td className="py-2 px-3 text-xs text-gray-400 font-mono">{wr}%</td>
      <td className={`py-2 px-3 text-xs font-mono font-semibold ${day.pl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
        {sign}${day.pl.toFixed(2)}
      </td>
      <td className={`py-2 px-3 text-xs font-mono font-semibold ${day.runningPl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
        {signR}${day.runningPl.toFixed(2)}
      </td>
    </tr>
  );
}

export default function Hero() {
  const { record, wins, losses, winRate, pl, roi, picks, days } = season2026;
  const plSign = pl >= 0 ? "+" : "";
  const totalRisked = picks * 100;

  return (
    <section className="relative min-h-screen flex flex-col justify-start pt-24 pb-12 grid-pattern">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-2 mb-6 flex-wrap"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live 2026 Forward Test - V2 Filter
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
            Apr 5 - Apr 14, 2026 - {days} days tracked
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-3"
        >
          <span className="text-white">MLB Pitcher Prop</span>{" "}
          <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
            Intelligence
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center text-base text-gray-400 max-w-2xl mx-auto mb-10"
        >
          Triple-XGBoost ensemble for pitcher strikeouts, walks, and hits allowed.
          Calibrated probabilities, walk-forward validated, live production record below.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6"
        >
          <div className="bg-gray-900/70 border border-amber-500/30 rounded-2xl p-5 md:p-6 text-center">
            <p className="text-[10px] text-amber-400/80 uppercase tracking-wider font-semibold mb-1">Record</p>
            <p className="text-4xl md:text-5xl font-black font-mono text-amber-400">{record}</p>
            <p className="text-[10px] text-gray-500 mt-1">{picks} picks - {days} days</p>
          </div>
          <div className="bg-gray-900/70 border border-emerald-500/30 rounded-2xl p-5 md:p-6 text-center">
            <p className="text-[10px] text-emerald-400/80 uppercase tracking-wider font-semibold mb-1">Win Rate</p>
            <p className="text-4xl md:text-5xl font-black font-mono text-emerald-400">{winRate}%</p>
            <p className="text-[10px] text-gray-500 mt-1">52.4% = break-even</p>
          </div>
          <div className="bg-gray-900/70 border border-violet-500/30 rounded-2xl p-5 md:p-6 text-center">
            <p className="text-[10px] text-violet-400/80 uppercase tracking-wider font-semibold mb-1">Total Profit</p>
            <p className="text-4xl md:text-5xl font-black font-mono text-violet-400">{plSign}${pl.toFixed(0)}</p>
            <p className="text-[10px] text-gray-500 mt-1">$100 flat bet per pick</p>
          </div>
          <div className="bg-gray-900/70 border border-cyan-500/30 rounded-2xl p-5 md:p-6 text-center">
            <p className="text-[10px] text-cyan-400/80 uppercase tracking-wider font-semibold mb-1">ROI</p>
            <p className="text-4xl md:text-5xl font-black font-mono text-cyan-400">{plSign}{roi}%</p>
            <p className="text-[10px] text-gray-500 mt-1">return on investment</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 md:p-6 mb-6"
        >
          <div className="flex items-start gap-3">
            <CalculatorIcon className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white mb-2">How the ROI is calculated</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                Every V2 pick is tracked as a <span className="text-white font-semibold">$100 flat bet</span> at
                the best available line across sportsbooks at the time the pick is published.
                ROI = <span className="font-mono text-cyan-400">total profit / total money risked</span>.
                Across {picks} picks ({picks} x $100 = ${totalRisked.toLocaleString()} risked), the V2 model has produced
                <span className="text-emerald-400 font-semibold"> {plSign}${pl.toFixed(2)}</span> of profit -
                a <span className="text-cyan-400 font-semibold">{plSign}{roi}% ROI</span>.
                For context, the break-even win rate at standard -110 juice is 52.4%; V2 is running at
                <span className="text-emerald-400 font-semibold"> {winRate}%</span>.
              </p>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                No parlays. No Kelly sizing. No cherry-picking - every pick that passes the V2 filter
                is tracked, win or lose, against the closing-time box score.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden"
        >
          <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-800 bg-gray-900/80">
            <ChartBarSquareIcon className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Day-by-Day Forward Test</h3>
            <span className="ml-auto text-[10px] text-gray-500 font-mono">Last updated {lastUpdated}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/40">
                  <th className="py-2 px-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-2 px-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">W-L</th>
                  <th className="py-2 px-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Win %</th>
                  <th className="py-2 px-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Day P&amp;L</th>
                  <th className="py-2 px-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Running P&amp;L</th>
                </tr>
              </thead>
              <tbody>
                {dailyResults.map((day) => (
                  <DayRow key={day.date} day={day} />
                ))}
                <tr className="border-t-2 border-gray-700 bg-gray-800/40">
                  <td className="py-3 px-3 text-xs text-white font-mono font-bold">TOTAL</td>
                  <td className="py-3 px-3 text-xs text-white font-mono font-bold">{wins}-{losses}</td>
                  <td className="py-3 px-3 text-xs text-emerald-400 font-mono font-bold">{winRate}%</td>
                  <td className="py-3 px-3 text-xs text-emerald-400 font-mono font-bold">{plSign}${pl.toFixed(2)}</td>
                  <td className="py-3 px-3 text-xs text-cyan-400 font-mono font-bold">{plSign}{roi}% ROI</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-5 py-2.5 border-t border-gray-800 bg-gray-900/50 flex items-center justify-between flex-wrap gap-2">
            <p className="text-[10px] text-gray-600 flex items-center gap-1.5">
              <ShieldCheckIcon className="w-3 h-3" />
              Clean forward test - filter locked pre-Apr 5, no retroactive changes
            </p>
            <a href="#performance" className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1">
              See P&amp;L chart
              <ArrowTrendingUpIcon className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
