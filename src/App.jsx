import AgeGate from "./components/AgeGate";
import PasswordGate from "./components/PasswordGate";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import BacktestSummary from "./sections/BacktestSummary";
import PicksDashboard from "./sections/PicksDashboard";
import Results from "./sections/Results";
import PerformanceTracker from "./sections/PerformanceTracker";
import Sportsbooks from "./sections/Sportsbooks";
import Footer from "./sections/Footer";

export default function App() {
  return (
    <AgeGate>
      <PasswordGate>
        <div className="min-h-screen">
          <Navbar />
          <Hero />
          <BacktestSummary />
          <PicksDashboard />
          <Results />
          <PerformanceTracker />
          <Sportsbooks />
          <Footer />
        </div>
      </PasswordGate>
    </AgeGate>
  );
}
