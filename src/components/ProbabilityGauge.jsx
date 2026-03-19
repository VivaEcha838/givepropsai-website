import { BREAK_EVEN } from "../data/constants";

export default function ProbabilityGauge({ pUnder, tier }) {
  // Scale: 0.40 to 0.75 maps to 0% to 100% width
  const min = 0.40;
  const max = 0.75;
  const pct = Math.max(0, Math.min(100, ((pUnder - min) / (max - min)) * 100));
  const bePct = ((BREAK_EVEN - min) / (max - min)) * 100;

  const tierColors = {
    ELITE: "from-amber-500 to-amber-400",
    PREMIUM: "from-violet-500 to-violet-400",
    STRONG: "from-cyan-500 to-cyan-400",
    STANDARD: "from-gray-500 to-gray-400",
  };

  const markerPositions = [
    { value: 0.60, label: "60" },
    { value: 0.63, label: "63" },
    { value: 0.66, label: "66" },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-[10px] text-gray-500 font-mono">p(under)</span>
        <span className="text-sm font-bold font-mono text-white">
          {(pUnder * 100).toFixed(1)}%
        </span>
      </div>
      <div className="relative h-2 bg-gray-800 rounded-full overflow-visible">
        {/* Fill bar */}
        <div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${tierColors[tier] || tierColors.STANDARD}`}
          style={{ width: `${pct}%` }}
        />
        {/* Break-even marker */}
        <div
          className="absolute top-0 h-2 w-px bg-gray-500"
          style={{ left: `${bePct}%` }}
        />
        {/* Tier threshold markers */}
        {markerPositions.map((m) => {
          const pos = ((m.value - min) / (max - min)) * 100;
          return (
            <div
              key={m.label}
              className="absolute -top-1 h-4 w-px bg-gray-600/50"
              style={{ left: `${pos}%` }}
            />
          );
        })}
      </div>
      <div className="relative h-3 mt-0.5">
        <span
          className="absolute text-[8px] text-gray-600 font-mono -translate-x-1/2"
          style={{ left: `${bePct}%` }}
        >
          BE
        </span>
        {markerPositions.map((m) => {
          const pos = ((m.value - min) / (max - min)) * 100;
          return (
            <span
              key={m.label}
              className="absolute text-[8px] text-gray-600 font-mono -translate-x-1/2"
              style={{ left: `${pos}%` }}
            >
              {m.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
