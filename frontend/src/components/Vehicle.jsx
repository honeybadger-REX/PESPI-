import { useEffect, useState } from "react";
import axios from "axios";
import Table from "./Table";
import Chart from "./Chart";

export default function Vehicle() {
  const [data, setData] = useState([]);

  const [data1, setData1] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/vehicle")
      .then((res) => {
        console.log("API DATA:", res.data);  // 🔍 debug
        setData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching vehicle data:", err);
      });
  }, []);
 

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/chartes")
      .then((res) => {
        console.log("API DATA:", res.data1);  // 🔍 debug
        setData1(res.data1);
      })
      .catch((err) => {
        console.error("Error fetching vehicle data:", err);
      });
  }, []);

  // 🔒 Safety check
  if (!data || data.length === 0) {
    return <p>No Vehicle Data Available</p>;
  }

  return (
    <div>
      <h2>Vehicle Data</h2>

      {/* 📊 Graph */}
      <Chart 
        data={data1.map((item, index) => ({
          index: index,
          confidence: item.confidens   // ⚠️ matches your DB spelling
        }))} 
        dataKey="confidence"
      />

      {/* 📋 Table */}
      <Table data={data} />
    </div>
  );
}
