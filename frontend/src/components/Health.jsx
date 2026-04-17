import { useEffect, useState } from "react";
import axios from "axios";
import Chart from "./Chart";
import Table from "./Table";

export default function Health() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/health")
      .then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>Road Health</h2>
      <Chart data={data} dataKey="road_health" />
      <Table data={data} />
    </div>
  );
}
