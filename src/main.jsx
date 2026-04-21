import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Global error listeners so anything that escapes React also gets surfaced
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    // eslint-disable-next-line no-console
    console.error('window.error:', e.message, e.filename, e.lineno);
  });
  window.addEventListener('unhandledrejection', (e) => {
    // eslint-disable-next-line no-console
    console.error('unhandledrejection:', e.reason);
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
