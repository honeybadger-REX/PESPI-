import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function Chart({ data, dataKey }) {
  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <LineChart data={data}>

          {/* Grid */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* ✅ X Axis FIXED */}
          <XAxis
            dataKey="index"   // 👈 use index (what you send)
            stroke="#8884d8"
          />

          {/* Y Axis */}
          <YAxis stroke="#82ca9d" />

          {/* Tooltip */}
          <Tooltip />

          {/* Legend */}
          <Legend />

          {/* Line */}
          <Line
            type="monotone"
            dataKey={dataKey}   // 👈 "confidence"
            stroke="#8884d8"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 7 }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
