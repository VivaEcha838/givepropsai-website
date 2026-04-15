import { motion } from "framer-motion";
import {
  ShieldCheckIcon,
  CpuChipIcon,
  ClockIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: ShieldCheckIcon,
    title: "Risk Management",
    desc: "Identify potentially mispriced pitcher props based on model output. Our models flag 5-10 high-edge opportunities daily across K, BB, and Hits. Past results do not guarantee future performance.",
  },
  {
    icon: CpuChipIcon,
    title: "Triple-Model Ensemble",
    desc: "Three XGBoost quantile regression models with calibrators. 45-48 features each: Statcast mechanics, lineup analysis, umpire tendencies, park factors.",
  },
  {
    icon: ClockIcon,
    title: "Pre-Game Delivery",
    desc: "Predictions available 2+ hours before first pitch with full lineup confirmation. Real-time updates if lineups change.",
  },
  {
    icon: CodeBracketIcon,
    title: "API Integration",
    desc: "RESTful JSON endpoint. Drop into your existing pipeline with a single API key. Sub-100ms response times.",
  },
];

const mockApiResponse = `{
  "game_pk": 746892,
  "pitcher": "Spencer Strider",
  "team": "ATL",
  "opponent": "NYM",
  "props": {
    "strikeouts": {
      "q35": 5.2, "q50": 6.8, "q65": 8.1,
      "p_under": 0.691, "line": 6.5, "tier": "ELITE"
    },
    "walks": {
      "q35": 1.1, "q50": 2.0, "q65": 2.8,
      "p_under": 0.632, "line": 1.5, "tier": "PREMIUM"
    },
    "hits_allowed": {
      "q35": 4.2, "q50": 5.8, "q65": 7.1,
      "p_under": 0.584, "line": 5.5, "tier": "STRONG"
    }
  },
  "lineup_k_rate": 0.262,
  "lineup_surprise": 0.032
}`;

export default function Sportsbooks() {
  return (
    <section id="sportsbooks" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/[0.02] to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-medium text-violet-400 uppercase tracking-wider">
            For Sportsbooks &amp; Data Partners
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">
            Pitcher Prop Line Analysis
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our triple-model system has historically identified potentially mispriced strikeout, walk, and hits allowed props in backtesting.
            Integrate our probability feeds to evaluate your lines. Past backtested performance does not guarantee future results.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors"
            >
              <f.icon className="w-8 h-8 text-violet-400 mb-3" />
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* API mock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 text-center">
            Sample API Response
          </h3>
          <div className="max-w-2xl mx-auto bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 border-b border-gray-800">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs text-gray-500 font-mono">
                GET /api/v1/predictions/today
              </span>
            </div>
            <pre className="p-4 text-xs font-mono text-gray-300 overflow-x-auto leading-relaxed">
              <code>{mockApiResponse}</code>
            </pre>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
