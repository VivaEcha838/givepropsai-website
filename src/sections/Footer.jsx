import { BoltIcon } from "@heroicons/react/24/solid";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <BoltIcon className="w-4 h-4 text-gray-950" />
            </div>
            <span className="text-sm font-bold text-white">Give Props</span>
            <span className="text-sm font-light text-amber-400">AI</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <a href="#picks" className="hover:text-gray-300 transition-colors">Picks</a>
            <a href="#performance" className="hover:text-gray-300 transition-colors">Performance</a>
            <a href="#sportsbooks" className="hover:text-gray-300 transition-colors">API</a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-gray-800/50">
          <p className="text-[10px] text-gray-600 text-center max-w-3xl mx-auto leading-relaxed">
            Give Props AI is a statistical research tool. Past backtested performance does not
            guarantee future results. All predictions are model-generated probabilities
            and should not be construed as financial advice. Sports betting involves risk
            of loss. Gamble responsibly. Data sourced from publicly available MLB Statcast
            records. Three models: Strikeouts (trained 2021-2024, validated 2024-25, 2 folds),
            Walks (trained 2021-2024, validated 2025, 1 fold), Hits Allowed (trained 2021-2024,
            validated 2025, 1 fold). All use walk-forward expanding window validation with zero
            data leakage and strategy-optimized betting filters. Forward test on 2026 spring training.
            Odds data from real sportsbook lines via The Odds API.
          </p>
        </div>
      </div>

      {/* Responsible Gambling Disclaimer */}
      <div className="bg-gray-950 border-t border-gray-800/30 py-6 px-4">
        <p className="text-[10px] text-gray-600 text-center max-w-4xl mx-auto leading-relaxed">
          For informational and entertainment purposes only. Give Props AI does not accept, place, or facilitate wagers.
          Past backtested performance does not guarantee future results. All results shown are from out-of-sample
          walk-forward validation and have not been verified in live betting. Please gamble responsibly. If you or
          someone you know has a gambling problem, call{" "}
          <a href="tel:18004262537" className="underline hover:text-gray-400 transition-colors">1-800-GAMBLER</a>{" "}
          (national) or 1-800-547-6133 (WA), or visit{" "}
          <a href="https://www.ncpgambling.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400 transition-colors">
            ncpgambling.org
          </a>. Must be 21+ to subscribe.
        </p>
        <p className="text-[10px] text-gray-700 text-center max-w-4xl mx-auto leading-relaxed mt-3">
          <strong className="text-gray-500">Not affiliated with MLB.</strong> Give Props AI is not affiliated with,
          endorsed by, or sponsored by Major League Baseball, its teams, players, or any related entity. All team
          names, player names, and trademarks remain the property of their respective owners.
        </p>
      </div>
    </footer>
  );
}
