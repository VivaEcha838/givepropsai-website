import { useState, useEffect } from "react";

export default function AgeGate({ children }) {
  const [verified, setVerified] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("giveprops_age_verified");
    if (stored === "true") setVerified(true);
  }, []);

  const handleYes = () => {
    sessionStorage.setItem("giveprops_age_verified", "true");
    setVerified(true);
  };

  const handleNo = () => {
    setDenied(true);
  };

  if (verified) return children;

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">
            Give Props <span className="text-amber-400">AI</span>
          </h1>
        </div>

        {denied ? (
          /* Denied state */
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
            <p className="text-gray-400 text-sm">
              You must be 21 or older to access this content.
            </p>
          </div>
        ) : (
          /* Age verification prompt */
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <span className="text-2xl font-black text-amber-400">21+</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Age Verification</h2>
            <p className="text-gray-400 text-sm mb-6">
              Are you 21 years of age or older?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleYes}
                className="flex-1 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold text-sm transition-colors"
              >
                Yes, I'm 21+
              </button>
              <button
                onClick={handleNo}
                className="flex-1 px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-sm transition-colors border border-gray-700"
              >
                No
              </button>
            </div>
          </div>
        )}

        <p className="text-gray-600 text-[10px] text-center mt-6 max-w-sm mx-auto leading-relaxed">
          This site contains sports betting analytics content intended for adults 21 and older.
          Please gamble responsibly.
        </p>
      </div>
    </div>
  );
}
