import { TIERS } from "../data/constants";

export default function TierBadge({ tier, size = "md" }) {
  const t = TIERS[tier] || TIERS.STANDARD;
  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wider uppercase
        ${t.bg} ${t.border} border ${t.text} ${sizes[size]}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
      {t.label}
    </span>
  );
}
