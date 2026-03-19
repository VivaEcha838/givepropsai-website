import PasswordGate from "./components/PasswordGate";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import ResultsShowcase from "./sections/ResultsShowcase";
import PicksDashboard from "./sections/PicksDashboard";
import PerformanceTracker from "./sections/PerformanceTracker";
import Sportsbooks from "./sections/Sportsbooks";
import Footer from "./sections/Footer";

export default function App() {
  return (
    <PasswordGate>
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <ResultsShowcase />
        <PicksDashboard />
        <PerformanceTracker />
        <Sportsbooks />
        <Footer />
      </div>
    </PasswordGate>
  );
}
