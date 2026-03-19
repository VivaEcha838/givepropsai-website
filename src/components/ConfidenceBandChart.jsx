import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function ConfidenceBandChart({ quantiles, consensusLine, tier }) {
  // Create data points for the band visualization
  const data = [
    { x: "Q35", value: quantiles.q35, low: quantiles.q35, high: quantiles.q65 },
    { x: "Q50", value: quantiles.q50, low: quantiles.q35, high: quantiles.q65 },
    { x: "Q65", value: quantiles.q65, low: quantiles.q35, high: quantiles.q65 },
  ];

  // Build a more visual representation: spread across synthetic x-axis
  const bandData = [];
  const steps = 50;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Bell-shaped: q35 at edges, q50 at center
    const mid = quantiles.q50;
    const spread = (quantiles.q65 - quantiles.q35) / 2;
    // Use a smooth curve
    const gaussFactor = Math.exp(-Math.pow((t - 0.5) * 4, 2));
    bandData.push({
      x: i,
      median: mid,
      upper: mid + spread * (0.3 + 0.7 * gaussFactor),
      lower: mid - spread * (0.3 + 0.7 * gaussFactor),
    });
  }

  const tierColors = {
    ELITE: { stroke: "#f59e0b", fill: "#f59e0b" },
    PREMIUM: { stroke: "#8b5cf6", fill: "#8b5cf6" },
    STRONG: { stroke: "#06b6d4", fill: "#06b6d4" },
    STANDARD: { stroke: "#6b7280", fill: "#6b7280" },
  };

  const colors = tierColors[tier] || tierColors.STANDARD;
  const yMin = Math.floor(Math.min(quantiles.q35, consensusLine) - 1);
  const yMax = Math.ceil(Math.max(quantiles.q65, consensusLine) + 1);

  return (
    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={bandData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`band-${tier}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.fill} stopOpacity={0.3} />
              <stop offset="100%" stopColor={colors.fill} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill={`url(#band-${tier})`}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="lower"
            stroke="none"
            fill="#030712"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="median"
            stroke={colors.stroke}
            strokeWidth={2}
            fill="none"
            dot={false}
            isAnimationActive={false}
          />
          <ReferenceLine
            y={consensusLine}
            stroke="#ef4444"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-between px-2 -mt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded" style={{ background: colors.stroke }} />
          <span className="text-[10px] text-gray-500">Model Q50</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded bg-red-500 opacity-60" style={{ backgroundImage: "repeating-linear-gradient(90deg, #ef4444 0, #ef4444 3px, transparent 3px, transparent 6px)" }} />
          <span className="text-[10px] text-gray-500">Consensus Line</span>
        </div>
      </div>
    </div>
  );
}
