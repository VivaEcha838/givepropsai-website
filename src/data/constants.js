// Real thresholds from production config.json
export const LOCKED_UNDER_THRESH = 0.65;
export const BREAK_EVEN = 0.524;
export const WIN_PAYOUT = 0.909;
export const GLOBAL_AVG_KR = 0.231;

// Tier definitions — based on Edge + calibrator p_win (K) or pure Edge (BB/Hits)
export const TIERS = {
  ELITE: {
    label: "ELITE",
    color: "amber",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    dot: "bg-amber-400",
    desc: "Highest confidence — strongest edge",
  },
  PREMIUM: {
    label: "PREMIUM",
    color: "violet",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    text: "text-violet-400",
    dot: "bg-violet-400",
    desc: "Strong edge — profitable tier",
  },
  STRONG: {
    label: "STRONG",
    color: "cyan",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    dot: "bg-cyan-400",
    desc: "Moderate edge — tracked only",
  },
  STANDARD: {
    label: "STANDARD",
    color: "gray",
    bg: "bg-gray-500/10",
    border: "border-gray-500/30",
    text: "text-gray-400",
    dot: "bg-gray-400",
    desc: "Model tracked",
  },
};

// ═══════════════════════════════════════════════════════════
// FINAL LOCKED RESULTS — Rolling Monthly Walk-Forward Backtest
// 2021-2023 base training + rolling 2024/2025 months.
// TimeSeriesSplit sort-fix applied. Zero data leakage.
// Updated March 2026 with post-audit validated thresholds.
// ═══════════════════════════════════════════════════════════

// Strikeout Model — Rolling Monthly Backtest (15 months, 2024-2025 OOS)
// Elite only: edge>=0.50 + calibrator p_win>=0.60
// p_win is the key discriminator for K — raw edge alone plateaus at 56% WR
export const PERFORMANCE = {
  walkForward: {
    totalPredictions: 7337,
    mispriced: 663,
    correct: 414,
    winRate: 0.624,
    profit: 46.3,
    pValue: 0.000001,
    folds: 15,
    season2024: { predictions: 283, correct: 179, winRate: 63.3, profit: 22.7 },
    season2025: { predictions: 380, correct: 235, winRate: 61.8, profit: 23.6 },
  },
  forwardTest: {
    predictions: 18,
    correct: 17,
    winRate: 0.944,
    profit: 14.5,
    pValue: 0.0002,
  },
  features: 48,
};

// Walk Model — Rolling Monthly Backtest (14 months, 2024-2025 OOS)
// Elite+Premium: edge>=0.50 (pure edge, no calibrator gate — calibrator hurts BB)
export const WALK_PERFORMANCE = {
  walkForward: {
    totalPredictions: 7945,
    mispriced: 1071,
    correct: 694,
    winRate: 0.648,
    profit: 49.3,
    pValue: 0.000000001,
    folds: 14,
    season2024: { predictions: 617, correct: 401, winRate: 65.0, profit: 31.0 },
    season2025: { predictions: 454, correct: 293, winRate: 64.5, profit: 18.3 },
  },
  features: 41,
};

// Hits Allowed Model — Rolling Monthly Backtest (14 months, 2024-2025 OOS)
// Elite+Premium: edge>=0.75 (pure edge, monotonic edge→WR relationship)
export const HITS_PERFORMANCE = {
  walkForward: {
    totalPredictions: 8292,
    mispriced: 707,
    correct: 438,
    winRate: 0.620,
    profit: 57.4,
    pValue: 0.000001,
    folds: 14,
    season2024: { predictions: 369, correct: 226, winRate: 61.2, profit: 28.6 },
    season2025: { predictions: 338, correct: 212, winRate: 62.7, profit: 28.8 },
  },
  features: 48,
};

// Combined model performance (all 3 models)
export const COMBINED = {
  totalPredictions: 2441,
  winRate: 0.633,
  profit: 153.1,
  pValue: 0.000000001,
  models: 3,
  props: ["Pitcher Strikeouts", "Pitcher Walks", "Pitcher Hits Allowed"],
  predictionsPerMonth: 174,
};

// Threshold markers for probability gauge
export const GAUGE_MARKERS = [
  { value: BREAK_EVEN, label: "BE", color: "text-gray-500" },
  { value: 0.58, label: "58%", color: "text-cyan-500" },
  { value: 0.62, label: "62%", color: "text-violet-500" },
  { value: 0.66, label: "66%", color: "text-amber-500" },
];
