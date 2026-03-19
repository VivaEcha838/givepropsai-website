import { motion } from "framer-motion";

export default function StatCard({ label, value, sub, accent = "amber" }) {
  const accents = {
    amber: "from-amber-500/20 to-amber-500/0 border-amber-500/20 text-amber-400",
    violet: "from-violet-500/20 to-violet-500/0 border-violet-500/20 text-violet-400",
    cyan: "from-cyan-500/20 to-cyan-500/0 border-cyan-500/20 text-cyan-400",
    emerald: "from-emerald-500/20 to-emerald-500/0 border-emerald-500/20 text-emerald-400",
    white: "from-white/10 to-white/0 border-white/10 text-white",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`
        relative overflow-hidden rounded-xl border bg-gradient-to-b p-5
        ${accents[accent]}
      `}
    >
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-3xl font-bold font-mono ${accents[accent].split(" ").pop()}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </motion.div>
  );
}
