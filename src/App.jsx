import AgeGate from "./components/AgeGate";
import PasswordGate from "./components/PasswordGate";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import BacktestSummary from "./sections/BacktestSummary";
import PicksDashboard from "./sections/PicksDashboard";
import Projections from "./sections/Projections";
import HitterProjections from "./sections/HitterProjections";
import Results from "./sections/Results";
import RecentStretch from "./components/RecentStretch";
import ArchetypeWatchlistAudit from "./components/ArchetypeWatchlistAudit";
import PerformanceTracker from "./sections/PerformanceTracker";
import Sportsbooks from "./sections/Sportsbooks";
import Footer from "./sections/Footer";

export default function App() {
  return (
    <AgeGate>
      <PasswordGate>
        <div className="min-h-screen">
          {/* Compliance top banner — always visible above Navbar */}
          <div className="fixed top-0 inset-x-0 z-[60] bg-gray-950 border-b border-amber-500/20 py-1.5 px-4">
            <p className="text-[10px] text-center text-amber-200/80 max-w-5xl mx-auto leading-snug">
              <strong className="text-amber-300">FOR INFORMATIONAL PURPOSES ONLY</strong>
              {" · "}
              Not betting advice. Past results do not predict future returns.
              {" · "}
              <strong className="text-amber-300">18+</strong> (21+ where required)
            </p>
          </div>
          <Navbar />
          <Hero />
          <BacktestSummary />
          <PicksDashboard />
          <Projections />
          <HitterProjections />
          <Results />
          <RecentStretch />
          <ArchetypeWatchlistAudit />
          <PerformanceTracker />
          <Sportsbooks />
          <Footer />
        </div>
      </PasswordGate>
    </AgeGate>
  );
}
