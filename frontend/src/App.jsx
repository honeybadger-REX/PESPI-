/**
 * App.jsx
 * Root component — sidebar (Navbar) + content area.
 * Import path assumes all components live in ./components/
 */

import { useState } from "react";
import Navbar  from "./components/Navbar";
import Vehicle from "./components/Vehicle";
import Pothole from "./components/Pothole";
import Crack   from "./components/Crack";
import Health  from "./components/Health";

// Inject Google Fonts once at app root
const FONT_LINK = "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap";

const VIEWS = {
  vehicle: <Vehicle />,
  pothole: <Pothole />,
  crack:   <Crack />,
  health:  <Health />,
};

export default function App() {
  const [view, setView] = useState("vehicle");

  return (
    <>
      {/* Font injection */}
      <link rel="stylesheet" href={FONT_LINK} />

      {/* Global reset */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0f14; }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
        /* Scrollbar styling */
        ::-webkit-scrollbar       { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0d0f14; }
        ::-webkit-scrollbar-thumb { background: #2a2f3d; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #374151; }
      `}</style>

      <div style={styles.layout}>
        {/* ── Sidebar ── */}
        <Navbar view={view} setView={setView} />

        {/* ── Content ── */}
        <main style={styles.content}>
          {VIEWS[view] ?? <Vehicle />}
        </main>
      </div>
    </>
  );
}

const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    background: "#0d0f14",
  },
  content: {
    marginLeft: 220,          // same width as Navbar sidebar
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
  },
};
