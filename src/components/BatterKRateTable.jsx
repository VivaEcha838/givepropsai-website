import { GLOBAL_AVG_KR } from "../data/constants";

export default function BatterKRateTable({ batters }) {
  const maxKRate = Math.max(...batters.map((b) => b.kRate), GLOBAL_AVG_KR + 0.05);

  return (
    <div className="space-y-1.5">
      {batters.map((batter, i) => {
        const pct = (batter.kRate / maxKRate) * 100;
        const avgPct = (GLOBAL_AVG_KR / maxKRate) * 100;
        const isAboveAvg = batter.kRate > GLOBAL_AVG_KR;

        return (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[10px] text-gray-600 w-4 text-right font-mono">
              {i + 1}
            </span>
            <span className="text-xs text-gray-500 w-5 font-mono">{batter.pos}</span>
            <span className="text-xs text-gray-300 w-24 truncate">{batter.name}</span>
            <div className="flex-1 relative h-4 bg-gray-800/50 rounded overflow-hidden">
              {/* League avg marker */}
              <div
                className="absolute top-0 bottom-0 w-px bg-gray-500/60 z-10"
                style={{ left: `${avgPct}%` }}
              />
              {/* K-rate bar */}
              <div
                className={`absolute top-0.5 bottom-0.5 left-0 rounded-r ${
                  isAboveAvg
                    ? "bg-gradient-to-r from-rose-500/60 to-rose-400/80"
                    : "bg-gradient-to-r from-emerald-500/60 to-emerald-400/80"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span
              className={`text-xs font-mono w-10 text-right ${
                isAboveAvg ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              .{(batter.kRate * 1000).toFixed(0).padStart(3, "0")}
            </span>
          </div>
        );
      })}
      <div className="flex items-center gap-2 pt-1 border-t border-gray-800/50">
        <span className="text-[10px] text-gray-600 w-4" />
        <span className="text-[10px] text-gray-600 w-5" />
        <span className="text-[10px] text-gray-500 w-24">MLB Avg</span>
        <div className="flex-1" />
        <span className="text-[10px] font-mono text-gray-500 w-10 text-right">
          .{(GLOBAL_AVG_KR * 1000).toFixed(0)}
        </span>
      </div>
    </div>
  );
}
