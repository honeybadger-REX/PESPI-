/**
 * Navbar.jsx
 * Vertical sidebar navigation for Road Monitoring Dashboard
 *
 * Props:
 *   view    – current active view string
 *   setView – setter from App state
 */

const NAV_ITEMS = [
  { id: "vehicle", label: "Vehicle",    icon: "🚗", accent: "#a78bfa" },
  { id: "pothole", label: "Pothole",    icon: "🕳",  accent: "#f97316" },
  { id: "crack",   label: "Crack",      icon: "⚡",  accent: "#fbbf24" },
  { id: "health",  label: "Road Health",icon: "📊",  accent: "#34d399" },
];

export default function Navbar({ view, setView }) {
  return (
    <aside style={styles.sidebar}>
      {/* Brand */}
      <div style={styles.brand}>
        <div style={styles.brandMark}>P</div>
        <div>
          <div style={styles.brandName}>Pavilion</div>
          <div style={styles.brandSub}>Road Monitor</div>
        </div>
      </div>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Nav label */}
      <div style={styles.sectionLabel}>MODULES</div>

      {/* Nav items */}
      <nav style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              style={{
                ...styles.navItem,
                ...(active ? {
                  background: item.accent + "18",
                  borderColor: item.accent + "55",
                  color: item.accent,
                } : {}),
              }}
            >
              {/* Active indicator bar */}
              <span style={{
                ...styles.activeBar,
                background: active ? item.accent : "transparent",
              }} />

              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>

              {active && (
                <span style={{ ...styles.activeDot, background: item.accent }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom badge */}
      <div style={styles.footer}>
        <div style={styles.liveRow}>
          <span style={styles.livePulse} />
          <span style={styles.liveText}>LIVE</span>
        </div>
        <div style={styles.footerSub}>API: 127.0.0.1:8000</div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 220,
    minHeight: "100vh",
    background: "#0a0c10",
    borderRight: "1px solid #1e222d",
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 100,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "0 20px",
    marginBottom: 20,
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Space Mono', monospace",
    fontWeight: 700,
    fontSize: 16,
    color: "#fff",
  },
  brandName: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 13,
    fontWeight: 700,
    color: "#e8eaf0",
    letterSpacing: 1,
  },
  brandSub: {
    fontSize: 10,
    color: "#4b5563",
    fontFamily: "monospace",
    letterSpacing: 1,
    marginTop: 2,
  },
  divider: {
    height: "1px",
    background: "#1e222d",
    margin: "0 0 20px",
  },
  sectionLabel: {
    fontSize: 9,
    fontFamily: "monospace",
    color: "#374151",
    letterSpacing: 2,
    padding: "0 20px",
    marginBottom: 8,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: "0 12px",
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid transparent",
    background: "transparent",
    color: "#6b7280",
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    transition: "all .2s",
    textAlign: "left",
    position: "relative",
    overflow: "hidden",
  },
  activeBar: {
    position: "absolute",
    left: 0,
    top: "20%",
    width: 3,
    height: "60%",
    borderRadius: "0 2px 2px 0",
    transition: "background .2s",
  },
  navIcon: {
    fontSize: 15,
    width: 20,
    textAlign: "center",
  },
  navLabel: {
    flex: 1,
    fontWeight: 400,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
  },
  footer: {
    padding: "20px",
    borderTop: "1px solid #1e222d",
    marginTop: 12,
  },
  liveRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  livePulse: {
    display: "inline-block",
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#34d399",
    animation: "pulse 1.5s infinite",
  },
  liveText: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "#34d399",
    letterSpacing: 1.5,
  },
  footerSub: {
    fontSize: 10,
    fontFamily: "monospace",
    color: "#374151",
    letterSpacing: 0.5,
  },
};
