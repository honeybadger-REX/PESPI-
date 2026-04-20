/**
 * Health.jsx
 * Displays road health data from /health endpoint.
 * Data shape expected: [{ segment_id, road_health, crack_score, pothole_score, surface_score, timestand }, ...]
 * road_health is a 0–1 float (higher = healthier).
 */

import { useEffect, useState } from "react";
import axios from "axios";
import Chart from "./Chart";
import Table from "./Table";

const ACCENT = "#34d399";   // green — health theme

const HEALTH_LEVELS = ["all", "good", "fair", "poor"];
const HEALTH_COLORS = {
  good: "#34d399",
  fair: "#fbbf24",
  poor: "#f87171",
};

function getHealthLevel(row) {
  if (row.health_level) return row.health_level;
  const h = row.road_health || 0;
  if (h >= 0.75) return "good";
  if (h >= 0.45) return "fair";
  return "poor";
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

export default function Health() {
  const [rawData, setRawData] = useState([]);
  const [filter,  setFilter]  = useState("all");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/health")
      .then((res) => setRawData(res.data))
      .catch((err) => {
        console.error("Health fetch error:", err);
        setError("Could not load road health data.");
      })
      .finally(() => setLoading(false));
  }, []);

  const tableRows =
    filter === "all"
      ? rawData
      : rawData.filter((r) => getHealthLevel(r) === filter);

  const avgHealth =
    tableRows.length
      ? ((tableRows.reduce((s, r) => s + (r.road_health || 0), 0) / tableRows.length) * 100).toFixed(1)
      : "0.0";

  const levelCounts = { good: 0, fair: 0, poor: 0 };
  rawData.forEach((r) => { const l = getHealthLevel(r); levelCounts[l]++; });

  // Line: road_health trend over segments
  const lineData = tableRows.length
    ? [
        {
          label: "road_health",
          color: ACCENT,
          points: tableRows.map((r, i) => ({
            index: "S" + (r.segment_id ?? i),
            value: +((r.road_health || 0) * 100).toFixed(1),
          })),
        },
        // Optional sub-scores if your API provides them
        ...(tableRows[0]?.crack_score !== undefined
          ? [{
              label: "crack",
              color: "#fbbf24",
              points: tableRows.map((r, i) => ({
                index: "S" + (r.segment_id ?? i),
                value: +((r.crack_score || 0) * 100).toFixed(1),
              })),
            }]
          : []),
        ...(tableRows[0]?.pothole_score !== undefined
          ? [{
              label: "pothole",
              color: "#f97316",
              points: tableRows.map((r, i) => ({
                index: "S" + (r.segment_id ?? i),
                value: +((r.pothole_score || 0) * 100).toFixed(1),
              })),
            }]
          : []),
      ]
    : null;

  // Bar: health level distribution
  const barData = {
    labels: ["Good", "Fair", "Poor"],
    values: [levelCounts.good, levelCounts.fair, levelCounts.poor],
    colors: [HEALTH_COLORS.good, HEALTH_COLORS.fair, HEALTH_COLORS.poor],
  };

  const enriched = tableRows.map((r) => ({ ...r, health_level: getHealthLevel(r) }));

  if (loading) return <p style={{ padding: 24, color: "#6b7280", fontFamily: "monospace" }}>Loading road health data…</p>;
  if (error)   return <p style={{ padding: 24, color: "#f87171", fontFamily: "monospace" }}>{error}</p>;

  return (
    <div style={S.page}>

      {/* Header */}
      <div style={S.header}>
        <div style={S.logo}>
          <span style={{ color: ACCENT }}>Pavilion</span> // Road Health
        </div>
        <div style={{ ...S.liveBadge, color: ACCENT }}>
          <span style={{ ...S.liveDot, background: ACCENT }} />
          LIVE
        </div>
      </div>

      {/* Filters */}
      <div style={S.filters}>
        {HEALTH_LEVELS.map((f) => {
          const col = f === "all" ? "#e8eaf0" : HEALTH_COLORS[f];
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
        <KPI label="Segments"    value={tableRows.length} sub={filter === "all" ? "all levels" : filter} color={ACCENT} />
        <KPI label="Avg Health"  value={avgHealth + "%"}   sub="road health" color={avgHealth > 75 ? "#34d399" : avgHealth > 45 ? "#fbbf24" : "#f87171"} />
        <KPI label="Good"        value={levelCounts.good}  sub="segments" color="#34d399" />
        <KPI label="Fair"        value={levelCounts.fair}  sub="segments" color="#fbbf24" />
        <KPI label="Poor"        value={levelCounts.poor}  sub="segments" color="#f87171" />
      </div>

      {/* Charts */}
      <div style={S.chartsRow}>
        <div style={S.card}>
          <div style={S.cardTitle}>Health Score — Line</div>
          <Chart type="line" multiData={lineData} />
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>Health Level — Bar</div>
          <Chart type="bar" barData={barData} />
        </div>
      </div>

      {/* Table */}
      <Table data={enriched} classColors={HEALTH_COLORS} classKey="health_level" />
    </div>
  );
}

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
