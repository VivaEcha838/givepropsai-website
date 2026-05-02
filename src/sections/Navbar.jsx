import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BoltIcon } from "@heroicons/react/24/solid";

const links = [
  { label: "Picks", href: "#picks" },
  { label: "Projections", href: "#projections" },
  { label: "Results", href: "#results" },
  { label: "Performance", href: "#performance" },
  { label: "Sportsbooks", href: "#sportsbooks" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/50 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <BoltIcon className="w-5 h-5 text-gray-950" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">
                Give Props
              </span>
              <span className="text-lg font-light text-amber-400 ml-1">AI</span>
            </div>
          </a>

          {/* Links */}
          <div className="hidden sm:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#sportsbooks"
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-semibold text-sm rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20"
          >
            Get Access
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
