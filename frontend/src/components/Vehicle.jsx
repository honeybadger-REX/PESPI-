import { useEffect, useState } from "react";
import axios from "axios";
import Chart from "./Chart";
import Table from "./Table";

export default function Vehicle() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/vehicle")
      .then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>Vehicle Data</h2>
      <Chart data={data} dataKey="confidence" />
      <Table data={data} />
    </div>
  );
}
