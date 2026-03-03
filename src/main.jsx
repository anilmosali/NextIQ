import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const globalStyles = document.createElement('style');
globalStyles.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

  @font-face {
    font-family: 'ABC Arizona Mix';
    src: url('/fonts/ABCArizonaMixVariable.ttf') format('truetype');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
  }

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  body {
    font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #FFFAF4;
  }

  input, button, select, textarea {
    font-family: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.25);
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes staggerFadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes autopilotPulse {
    0%, 100% { box-shadow: 0 0 6px 0 rgba(0, 98, 184, 0.25), 0 0 20px -4px rgba(0, 98, 184, 0.15); }
    50% { box-shadow: 0 0 14px 2px rgba(0, 98, 184, 0.35), 0 0 30px 0 rgba(0, 98, 184, 0.2); }
  }

  @keyframes autopilotGlow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  @keyframes autopilotBorderSweep {
    0% { background: conic-gradient(from 0deg, rgba(0,98,184,0.8) 0%, transparent 0%); }
    25% { background: conic-gradient(from 0deg, rgba(0,98,184,0.8) 0%, rgba(0,98,184,0.5) 25%, transparent 25%); }
    50% { background: conic-gradient(from 0deg, rgba(0,98,184,0.8) 0%, rgba(0,98,184,0.5) 50%, transparent 50%); }
    75% { background: conic-gradient(from 0deg, rgba(0,98,184,0.8) 0%, rgba(0,98,184,0.5) 75%, transparent 75%); }
    100% { background: conic-gradient(from 0deg, rgba(0,98,184,0.8) 0%, rgba(0,98,184,0.5) 100%, transparent 100%); }
  }

  @keyframes coachTabPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.5); }
    50% { box-shadow: 0 0 0 5px rgba(245, 158, 11, 0); }
  }

  @keyframes coachTabPulseCritical {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
    50% { box-shadow: 0 0 0 5px rgba(239, 68, 68, 0); }
  }

  @keyframes toastSlideIn {
    from { opacity: 0; transform: translateY(12px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes toastSlideOut {
    from { opacity: 1; transform: translateY(0) scale(1); }
    to { opacity: 0; transform: translateY(12px) scale(0.97); }
  }
`;
document.head.appendChild(globalStyles);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
