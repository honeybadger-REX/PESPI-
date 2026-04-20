/**
 * Table.jsx  — universal table for all Pavilion modules
 *
 * Props:
 *   data        – array of records from any endpoint
 *   classColors – color map keyed by the badge value  e.g. { heavy:"#a78bfa", ... }
 *   classKey    – which field to use as the coloured badge column (default: "class")
 */

const DEFAULT_COLORS = {
  heavy:    "#a78bfa",
  medium:   "#34d399",
  light:    "#60a5fa",
  high:     "#f87171",
  fair:     "#fbbf24",
  low:      "#34d399",
  good:     "#34d399",
  poor:     "#f87171",
  wide:     "#f87171",
  hairline: "#60a5fa",
};

export default function Table({ data, classColors, classKey = "class" }) {
  const C = { ...DEFAULT_COLORS, ...(classColors || {}) };

  if (!data || data.length === 0) {
    return <div style={styles.empty}>// NO DATA</div>;
  }

  const allKeys    = Object.keys(data[0]);
  const priority   = ["track_id", "segment_id", classKey];
  const restKeys   = allKeys.filter((k) => !priority.includes(k) && k !== "_id");
  const orderedKeys = [...priority.filter((k) => allKeys.includes(k)), ...restKeys];

  const renderCell = (key, val) => {
    if (val === null || val === undefined) return <span style={{ color: "#4b5563" }}>—</span>;

    if (key === classKey) {
      const color = C[val] || "#888";
      return (
        <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:3, fontSize:10,
          fontFamily:"monospace", fontWeight:700, textTransform:"uppercase", letterSpacing:.5,
          color, background:color+"22", border:`1px solid ${color}44` }}>
          {val}
        </span>
      );
    }

    if (key === "bbox" && typeof val === "object") {
      return <span style={styles.mono}>x0:{val.x0} y0:{val.y0} x1:{val.x1} y1:{val.y1}</span>;
    }

    const confKeys = ["confidence","confidens","road_health","crack_score","pothole_score","surface_score"];
    if (confKeys.includes(key) && typeof val === "number") {
      const pct   = Math.round(val * 100);
      const color = pct >= 80 ? "#34d399" : pct >= 55 ? "#fbbf24" : "#f87171";
      return (
        <div>
          <span style={{ ...styles.mono, color, fontSize:12 }}>{pct}%</span>
          <div style={styles.trackBg}>
            <div style={{ ...styles.trackFill, width:pct+"%", background:color }} />
          </div>
        </div>
      );
    }

    if ((key === "timestand" || key === "timestamp") && typeof val === "string") {
      try {
        return <span style={styles.time}>{new Date(val).toLocaleTimeString("en-GB")}</span>;
      } catch { return val; }
    }

    if (key === "track_id" || key === "segment_id") return <span style={styles.mono}>#{val}</span>;
    if (typeof val === "object") return <span style={styles.time}>{JSON.stringify(val)}</span>;
    return <span style={{ fontSize:13 }}>{String(val)}</span>;
  };

  const gridCols = orderedKeys.map((k) => {
    if (k === "track_id" || k === "segment_id") return "60px";
    if (k === classKey)   return "110px";
    if (k === "bbox")     return "200px";
    if (["confidence","confidens","road_health","crack_score","pothole_score"].includes(k)) return "110px";
    if (k === "timestand" || k === "timestamp") return "80px";
    return "1fr";
  }).join(" ");

  return (
    <div style={styles.wrapper}>
      <div style={{ ...styles.headRow, gridTemplateColumns:gridCols }}>
        {orderedKeys.map((k) => (
          <div key={k} style={styles.th}>{k.replace(/_/g," ")}</div>
        ))}
      </div>
      <div style={styles.body}>
        {data.map((row, i) => (
          <div key={i} style={{ ...styles.dataRow, gridTemplateColumns:gridCols }}>
            {orderedKeys.map((k) => (
              <div key={k} style={styles.cell}>{renderCell(k, row[k])}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper:  { background:"#161920", border:"1px solid #2a2f3d", borderRadius:8, overflow:"hidden" },
  headRow:  { display:"grid", padding:"10px 16px", background:"#1e222d", borderBottom:"1px solid #2a2f3d", gap:8 },
  th:       { fontSize:10, fontFamily:"monospace", color:"#6b7280", letterSpacing:1.5, textTransform:"uppercase", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" },
  body:     { maxHeight:380, overflowY:"auto" },
  dataRow:  { display:"grid", padding:"10px 16px", borderBottom:"1px solid #2a2f3d", alignItems:"center", gap:8, transition:"background .15s", cursor:"default" },
  cell:     { overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },
  mono:     { fontFamily:"monospace", fontSize:12, color:"#e8eaf0" },
  time:     { fontFamily:"monospace", fontSize:10, color:"#6b7280" },
  trackBg:  { height:3, background:"#2a2f3d", borderRadius:2, marginTop:4 },
  trackFill:{ height:3, borderRadius:2, transition:"width .3s" },
  empty:    { padding:40, textAlign:"center", color:"#6b7280", fontFamily:"monospace", fontSize:12, letterSpacing:1, background:"#161920", border:"1px solid #2a2f3d", borderRadius:8 },
};
