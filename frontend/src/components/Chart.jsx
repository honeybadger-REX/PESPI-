/**
 * Chart.jsx
 *
 * Props (line mode):
 *   type="line"
 *   multiData = [
 *     { label: "heavy", color: "#a78bfa", points: [{index:"T1", value:76}, ...] },
 *     ...
 *   ]
 *
 * Props (bar mode):
 *   type="bar"
 *   barData = { labels:["heavy","medium","light"], values:[4,3,3], colors:["#a78bfa","#34d399","#60a5fa"] }
 *
 * Legacy single-series (backward compat):
 *   data={[{index, confidence}]} dataKey="confidence"
 */

import {
  LineChart, Line,
  BarChart,  Bar,
  XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
  Legend, Cell,
} from "recharts";

const DARK = {
  grid:   "rgba(255,255,255,0.06)",
  axis:   "#6b7280",
  bg:     "transparent",
  tooltip: { background: "#1e222d", border: "1px solid #2a2f3d", color: "#e8eaf0" },
};

// ── Tooltip ────────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e222d", border: "1px solid #2a2f3d", borderRadius: 6, padding: "8px 12px", fontSize: 12, fontFamily: "monospace" }}>
      <p style={{ color: "#6b7280", marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "#e8eaf0" }}>
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(1) + "%" : p.value}
        </p>
      ))}
    </div>
  );
}

// ── Line chart (multi-class) ────────────────────────────────────────────────
function MultiLineChart({ multiData }) {
  if (!multiData || !multiData.length) return <p style={{ color: "#6b7280", fontSize: 12 }}>No data</p>;

  // Merge all classes into one data array keyed by index
  const allIndices = [...new Set(multiData.flatMap((g) => g.points.map((p) => p.index)))];
  const merged = allIndices.map((idx) => {
    const row = { index: idx };
    multiData.forEach((g) => {
      const pt = g.points.find((p) => p.index === idx);
      row[g.label] = pt ? pt.value : null;
    });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={merged}>
        <CartesianGrid strokeDasharray="3 3" stroke={DARK.grid} />
        <XAxis dataKey="index" stroke={DARK.axis} tick={{ fontSize: 10, fontFamily: "monospace", fill: DARK.axis }} />
        <YAxis domain={[0, 100]} stroke={DARK.axis} tick={{ fontSize: 10, fontFamily: "monospace", fill: DARK.axis }} tickFormatter={(v) => v + "%"} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace", color: "#6b7280" }} />
        {multiData.map((g) => (
          <Line
            key={g.label}
            type="monotone"
            dataKey={g.label}
            stroke={g.color}
            strokeWidth={2}
            dot={{ r: 3, fill: g.color }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── Bar chart ──────────────────────────────────────────────────────────────
function ClassBarChart({ barData }) {
  if (!barData) return <p style={{ color: "#6b7280", fontSize: 12 }}>No data</p>;

  const chartData = barData.labels.map((label, i) => ({
    label: label.charAt(0).toUpperCase() + label.slice(1),
    value: barData.values[i],
    color: barData.colors[i],
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={DARK.grid} vertical={false} />
        <XAxis dataKey="label" stroke={DARK.axis} tick={{ fontSize: 10, fontFamily: "monospace", fill: DARK.axis }} />
        <YAxis stroke={DARK.axis} tick={{ fontSize: 10, fontFamily: "monospace", fill: DARK.axis }} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color + "55"} stroke={entry.color} strokeWidth={1.5} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Legacy single-line (backward compat) ───────────────────────────────────
function LegacyLineChart({ data, dataKey }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={DARK.grid} />
        <XAxis dataKey="index" stroke={DARK.axis} tick={{ fontSize: 10, fill: DARK.axis }} />
        <YAxis stroke={DARK.axis} tick={{ fontSize: 10, fill: DARK.axis }} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey={dataKey} stroke="#a78bfa" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export default function Chart({ type, multiData, barData, data, dataKey }) {
  if (type === "bar")  return <ClassBarChart barData={barData} />;
  if (multiData)       return <MultiLineChart multiData={multiData} />;
  return <LegacyLineChart data={data} dataKey={dataKey} />;
}

