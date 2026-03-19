import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from "@heroicons/react/20/solid";

export default function LineupSurpriseIndicator({ value }) {
  if (value === 0 || value === undefined || value === null) return null;

  const isPositive = value > 0;
  const absVal = Math.abs(value * 100).toFixed(1);

  if (Math.abs(value) < 0.005) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-gray-800 text-gray-500">
        <MinusIcon className="w-3 h-3" />
        {absVal}%
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
        isPositive
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
      }`}
    >
      {isPositive ? (
        <ArrowTrendingUpIcon className="w-3 h-3" />
      ) : (
        <ArrowTrendingDownIcon className="w-3 h-3" />
      )}
      {isPositive ? "+" : "-"}{absVal}%
    </span>
  );
}
