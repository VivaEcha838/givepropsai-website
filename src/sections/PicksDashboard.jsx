import { useState } from "react";
import { motion } from "framer-motion";
import PickCard from "../components/PickCard";
import { mockPicks } from "../data/picks";
import { FunnelIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

export default function PicksDashboard() {
  const [showMispricedOnly, setShowMispricedOnly] = useState(false);

  const picks = showMispricedOnly
    ? mockPicks.filter((p) => p.isMispriced)
    : mockPicks;

  const sortedPicks = [...picks].sort((a, b) => b.pUnder - a.pUnder);
  const mispricedCount = mockPicks.filter((p) => p.isMispriced).length;

  return (
    <section id="picks" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">
              Today's Slate
            </h2>
            <p className="text-gray-400">
              {mockPicks.length} games analyzed &middot;{" "}
              <span className="text-amber-400 font-semibold">{mispricedCount} mispriced lines found</span>
            </p>
          </div>

          {/* Filter toggle */}
          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            <button
              onClick={() => setShowMispricedOnly(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                !showMispricedOnly
                  ? "bg-gray-800 text-white border border-gray-700"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Squares2X2Icon className="w-3.5 h-3.5" />
              All Games
            </button>
            <button
              onClick={() => setShowMispricedOnly(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                showMispricedOnly
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <FunnelIcon className="w-3.5 h-3.5" />
              Mispriced Only
            </button>
          </div>
        </motion.div>

        {/* Pick cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedPicks.map((pick, i) => (
            <motion.div
              key={pick.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <PickCard pick={pick} />
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            ELITE: max edge + both models agree &mdash; 61-66% win rate
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            PREMIUM: strong edge + both models agree &mdash; 60-64% win rate
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            STRONG: moderate edge + both models agree
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-500" />
            STANDARD: model-tracked only (not recommended)
          </div>
        </motion.div>
      </div>
    </section>
  );
}
