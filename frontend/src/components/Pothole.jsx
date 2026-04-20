/**
 * Pothole.jsx
 * Displays pothole detection data from /pothole endpoint.
 * Data shape expected: [{ track_id, confidence, bbox, severity, image_path, timestand }, ...]
 * "severity" is optional — if your model produces it, it will show; otherwise falls back to confidence bands.
 */

import { useEffect, useState } from "react";
import axios from "axios";
import Chart from "./Chart";
import Table from "./Table";

const ACCENT       = "#f97316";   // orange — pothole theme
const ACCENT_DIM   = "rgba(249,115,22,0.15)";
const SEVERITY_MAP = { high: "#f87171", medium: "#fbbf24", low: "#34d399" };

const FILTERS = ["all", "high", "medium", "low"];

function getSeverity(row) {
  if (row.severity) return row.severity;
  const c = row.confidence || 0;
  if (c >= 0.8) return "high";
  if (c >= 0.55) return "medium";
  return "low";
}

function KPI({ label, value, sub, color }) {
  return (
    <div style={S.kpi}>
      <div style={S.kpiLabel}>{label}</div>
      <div style={{ ...S.kpiVal, ...(color ? { color } : {}) }}>{value}</div>
      <div style={S.kpiSub}>{sub}</div>
    </div>
  );
}

export default function Pothole() {
  const [rawData, setRawData] = useState([]);
  const [filter,  setFilter]  = useState("all");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/pothole")
      .then((res) => setRawData(res.data))
      .catch((err) => {
        console.error("Pothole fetch error:", err);
        setError("Could not load pothole data.");
      })
      .finally(() => setLoading(false));
  }, []);

  const tableRows =
    filter === "all"
      ? rawData
      : rawData.filter((r) => getSeverity(r) === filter);

  const avg =
    tableRows.length
      ? ((tableRows.reduce((s, r) => s + (r.confidence || 0), 0) / tableRows.length) * 100).toFixed(1)
      : "0.0";

  const sevCounts = { high: 0, medium: 0, low: 0 };
  rawData.forEach((r) => { const s = getSeverity(r); sevCounts[s]++; });

  // Line data: confidence over track index
  const lineData = tableRows.length
    ? [{
        label: "confidence",
        color: ACCENT,
        points: tableRows.map((r, i) => ({
          index: "P" + (r.track_id ?? i),
          value: +((r.confidence || 0) * 100).toFixed(1),
        })),
      }]
    : null;

  // Bar data: severity distribution
  const barData = {
    labels: ["High", "Medium", "Low"],
    values: [sevCounts.high, sevCounts.medium, sevCounts.low],
    colors: [SEVERITY_MAP.high, SEVERITY_MAP.medium, SEVERITY_MAP.low],
  };

  // Enrich rows for Table
  const enriched = tableRows.map((r) => ({
    ...r,
    severity: getSeverity(r),
  }));

  const severityColors = { high: "#f87171", medium: "#fbbf24", low: "#34d399" };

  if (loading) return <p style={{ padding: 24, color: "#6b7280", fontFamily: "monospace" }}>Loading pothole data…</p>;
  if (error)   return <p style={{ padding: 24, color: "#f87171", fontFamily: "monospace" }}>{error}</p>;

  return (
    <div style={S.page}>

      {/* Header */}
      <div style={S.header}>
        <div style={S.logo}>
          <span style={{ color: ACCENT }}>Pavilion</span> // Pothole Detection
        </div>
        <div style={{ ...S.liveBadge, color: ACCENT }}>
          <span style={{ ...S.liveDot, background: ACCENT }} />
          LIVE
        </div>
      </div>

      {/* Filters */}
      <div style={S.filters}>
        {FILTERS.map((f) => {
          const col = f === "all" ? "#e8eaf0" : SEVERITY_MAP[f];
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...S.pill,
                ...(filter === f ? { borderColor: col, color: col, background: "rgba(255,255,255,0.06)" } : {}),
              }}
            >
              {f.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* KPIs */}
      <div style={S.kpiGrid}>
        <KPI label="Potholes"   value={tableRows.length} sub={filter === "all" ? "all severity" : filter} color={ACCENT} />
        <KPI label="Avg Conf"   value={avg + "%"}         sub="confidence" color={avg > 80 ? "#34d399" : avg > 60 ? "#fbbf24" : "#f87171"} />
        <KPI label="High"       value={sevCounts.high}    sub="severity"   color="#f87171" />
        <KPI label="Medium"     value={sevCounts.medium}  sub="severity"   color="#fbbf24" />
        <KPI label="Low"        value={sevCounts.low}     sub="severity"   color="#34d399" />
      </div>

      {/* Charts */}
      <div style={S.chartsRow}>
        <div style={S.card}>
          <div style={S.cardTitle}>Confidence — Line</div>
          <Chart type="line" multiData={lineData} />
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>Severity — Bar</div>
          <Chart type="bar" barData={barData} />
        </div>
      </div>

      {/* Table */}
      <Table data={enriched} classColors={severityColors} classKey="severity" />
    </div>
  );
}

// ── Inline shared styles (mirrors Vehicle.jsx tokens) ─────────────────────
const S = {
  page:      { background: "#0d0f14", minHeight: "100vh", padding: 24, color: "#e8eaf0", fontFamily: "'DM Sans', sans-serif" },
  header:    { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  logo:      { fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#6b7280", letterSpacing: 2 },
  liveBadge: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: "monospace" },
  liveDot:   { display: "inline-block", width: 6, height: 6, borderRadius: "50%" },
  filters:   { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  pill:      { padding: "6px 16px", borderRadius: 4, border: "1px solid #2a2f3d", fontSize: 11, fontFamily: "monospace", cursor: "pointer", background: "transparent", color: "#6b7280", letterSpacing: 1, transition: "all .2s" },
  kpiGrid:   { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 20 },
  kpi:       { background: "#161920", border: "1px solid #2a2f3d", borderRadius: 8, padding: "14px 16px" },
  kpiLabel:  { fontSize: 10, fontFamily: "monospace", color: "#6b7280", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 },
  kpiVal:    { fontSize: 26, fontFamily: "monospace", fontWeight: 700, lineHeight: 1 },
  kpiSub:    { fontSize: 11, color: "#6b7280", marginTop: 6 },
  chartsRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 },
  card:      { background: "#161920", border: "1px solid #2a2f3d", borderRadius: 8, padding: 20 },
  cardTitle: { fontSize: 10, fontFamily: "monospace", color: "#6b7280", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 },
};
