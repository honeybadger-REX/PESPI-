import { useEffect, useState } from "react";
import axios from "axios";
import Table from "./Table";
import Chart from "./Chart";

const CLASS_COLORS = {
  heavy: "#a78bfa",
  medium: "#34d399",
  light: "#60a5fa",
};

const FILTERS = ["all", "heavy", "medium", "light"];

export default function Vehicle() {
  const [rawData, setRawData]   = useState([]);   // /vehicle  – table rows
  const [chartData, setChartData] = useState(null); // /chartes  – {bar, line}
  const [filter, setFilter]     = useState("all");
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // ── Fetch table data ───────────────────────────────────────────────────────
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/vehicle")
      .then((res) => setRawData(res.data))
      .catch((err) => {
        console.error("Vehicle fetch error:", err);
        setError("Could not load vehicle data.");
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Fetch chart data ───────────────────────────────────────────────────────
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/chartes")
      .then((res) => setChartData(res.data))
      .catch((err) => console.error("Chart fetch error:", err));
  }, []);

  // ── Filtered table rows ────────────────────────────────────────────────────
  const tableRows =
    filter === "all" ? rawData : rawData.filter((r) => r.class === filter);

  // ── KPI summaries ──────────────────────────────────────────────────────────
  const avg =
    tableRows.length
      ? (
          (tableRows.reduce((s, r) => s + (r.confidens || 0), 0) /
            tableRows.length) *
          100
        ).toFixed(1)
      : "0.0";

  const classCounts = { heavy: 0, medium: 0, light: 0 };
  rawData.forEach((r) => {
    if (classCounts[r.class] !== undefined) classCounts[r.class]++;
  });

  // ── Line chart data from /chartes ──────────────────────────────────────────
  const buildLineData = () => {
    if (!chartData?.line) return null;

    // chartData.line = [{class:"heavy", data:[{track_id,confidens,...}]}, ...]
    const filtered =
      filter === "all"
        ? chartData.line
        : chartData.line.filter((g) => g.class === filter);

    return filtered.map((group) => ({
      label: group.class,
      color: CLASS_COLORS[group.class] || "#888",
      points: group.data.map((d, i) => ({
        index: "T" + (d.track_id ?? i),
        value: +(d.confidens * 100).toFixed(1),
      })),
    }));
  };

  // ── Bar chart data from /chartes ───────────────────────────────────────────
  const buildBarData = () => {
    if (!chartData?.bar) return null;
    // chartData.bar = { labels:[...], counts:[...] }
    return {
      labels: chartData.bar.labels,
      values: chartData.bar.counts,
      colors: chartData.bar.labels.map((l) => CLASS_COLORS[l] || "#888"),
    };
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) return <p style={{ padding: 24 }}>Loading vehicle data…</p>;
  if (error)   return <p style={{ padding: 24, color: "red" }}>{error}</p>;

  return (
    <div style={styles.app}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span>Pavilion</span> // Vehicle Live
        </div>
        <div style={styles.liveBadge}>
          <span style={styles.liveDot} />
          LIVE
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...styles.pill,
              ...(filter === f
                ? { borderColor: CLASS_COLORS[f] ?? "#e8eaf0", color: CLASS_COLORS[f] ?? "#e8eaf0", background: "rgba(255,255,255,0.07)" }
                : {}),
            }}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div style={styles.kpiGrid}>
        <KPI label="Vehicles"   value={tableRows.length} sub={filter === "all" ? "all classes" : filter} />
        <KPI label="Avg Conf"   value={avg + "%"}         sub="confidence" color={avg > 80 ? "#34d399" : avg > 60 ? "#fbbf24" : "#f87171"} />
        <KPI label="Heavy"      value={classCounts.heavy}  sub="detections" color="#a78bfa" />
        <KPI label="Medium"     value={classCounts.medium} sub="detections" color="#34d399" />
        <KPI label="Light"      value={classCounts.light}  sub="detections" color="#60a5fa" />
      </div>

      {/* Charts */}
      <div style={styles.chartsRow}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Confidence — Line</div>
          <Chart type="line" multiData={buildLineData()} />
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Detections — Bar</div>
          <Chart type="bar" barData={buildBarData()} />
        </div>
      </div>

      {/* Table */}
      <Table data={tableRows} classColors={CLASS_COLORS} />
    </div>
  );
}

function KPI({ label, value, sub, color }) {
  return (
    <div style={styles.kpi}>
      <div style={styles.kpiLabel}>{label}</div>
      <div style={{ ...styles.kpiVal, ...(color ? { color } : {}) }}>{value}</div>
      <div style={styles.kpiSub}>{sub}</div>
    </div>
  );
}

const styles = {
  app:        { background: "#0d0f14", minHeight: "100vh", padding: 24, color: "#e8eaf0", fontFamily: "'DM Sans', sans-serif" },
  header:     { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  logo:       { fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#6b7280", letterSpacing: 2 },
  liveBadge:  { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#34d399", fontFamily: "monospace" },
  liveDot:    { display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#34d399" },
  filters:    { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  pill:       { padding: "6px 16px", borderRadius: 4, border: "1px solid #2a2f3d", fontSize: 11, fontFamily: "monospace", cursor: "pointer", background: "transparent", color: "#6b7280", letterSpacing: 1, transition: "all .2s" },
  kpiGrid:    { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 20 },
  kpi:        { background: "#161920", border: "1px solid #2a2f3d", borderRadius: 8, padding: "14px 16px" },
  kpiLabel:   { fontSize: 10, fontFamily: "monospace", color: "#6b7280", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 },
  kpiVal:     { fontSize: 26, fontFamily: "monospace", fontWeight: 700, lineHeight: 1 },
  kpiSub:     { fontSize: 11, color: "#6b7280", marginTop: 6 },
  chartsRow:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 },
  card:       { background: "#161920", border: "1px solid #2a2f3d", borderRadius: 8, padding: 20 },
  cardTitle:  { fontSize: 10, fontFamily: "monospace", color: "#6b7280", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 },
};

