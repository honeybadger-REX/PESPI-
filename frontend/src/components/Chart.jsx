import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function Chart({ data, dataKey }) {
  return (
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="timestamp" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey={dataKey} />
    </LineChart>
  );
}
