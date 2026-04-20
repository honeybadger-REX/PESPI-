export default function Table({ data }) {
  if (!data || data.length === 0) {
    return <p>No Data Available</p>;
  }

  const renderValue = (key, val) => {
    if (val === null || val === undefined) return "-";

    // 🔥 Handle bbox specifically
    if (key === "bbox" && typeof val === "object") {
      return `x0:${val.x0}, y0:${val.y0}, x1:${val.x1}, y1:${val.y1}`;
    }

    // Handle generic objects
    if (typeof val === "object") {
      return JSON.stringify(val);
    }
    print(val)
    return val;
  };

  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          {Object.keys(data[0]).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {Object.keys(row).map((key, j) => (
              <td key={j}>{renderValue(key, row[key])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
