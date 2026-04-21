import { Component } from "react";

/**
 * ErrorBoundary — catches React render crashes and displays the error
 * instead of the app going to a black screen. Critical for debugging
 * deploys where we can't see the user's browser console.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-gray-950 text-white p-6 font-mono">
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold text-rose-400">
              ⚠ Site crashed while rendering
            </h1>
            <p className="text-sm text-gray-400">
              This is the JavaScript error. Screenshot and send back.
            </p>
            <div className="bg-rose-500/10 border border-rose-500/30 rounded p-4 text-sm">
              <div className="font-bold text-rose-300 mb-2">
                {this.state.error.name}: {this.state.error.message}
              </div>
              {this.state.error.stack && (
                <pre className="text-xs text-gray-300 whitespace-pre-wrap overflow-x-auto">
                  {this.state.error.stack}
                </pre>
              )}
            </div>
            {this.state.errorInfo && this.state.errorInfo.componentStack && (
              <div className="bg-gray-900 border border-gray-800 rounded p-4 text-sm">
                <div className="font-bold text-gray-300 mb-2">
                  Component stack
                </div>
                <pre className="text-xs text-gray-400 whitespace-pre-wrap overflow-x-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
            <p className="text-xs text-gray-600 mt-8">
              Location: {typeof window !== "undefined" ? window.location.href : "?"}
              <br />
              User agent:{" "}
              {typeof navigator !== "undefined" ? navigator.userAgent : "?"}
              <br />
              Time: {new Date().toISOString()}
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
