import { useState, useEffect } from "react";

const PASS_HASH = "f68d8ddd"; // hash of the password - not the password itself

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return (hash >>> 0).toString(16).slice(0, 8);
}

export default function PasswordGate({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("giveprops_auth");
    if (stored === PASS_HASH) setAuthenticated(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (simpleHash(password) === PASS_HASH) {
      sessionStorage.setItem("giveprops_auth", PASS_HASH);
      setAuthenticated(true);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (authenticated) return children;

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Give Props <span className="text-emerald-400">AI</span>
          </h1>
          <p className="text-gray-400 text-sm">Enter password to continue</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`transition-transform ${shake ? "animate-shake" : ""}`}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className={`w-full px-4 py-3 rounded-lg bg-gray-900 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-700 focus:ring-emerald-500"
            }`}
          />
          <button
            type="submit"
            className="w-full mt-4 px-4 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold transition-colors"
          >
            Enter
          </button>
          {error && (
            <p className="text-red-400 text-sm text-center mt-3">
              Incorrect password
            </p>
          )}
        </form>

        <p className="text-gray-600 text-xs text-center mt-6">
          Confidential — Authorized access only
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-4px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
