import { useState } from "react";
import Vehicle from "./components/Vehicle";
import Pothole from "./components/Pothole";
import Crack from "./components/Crack";
import Health from "./components/Health";

export default function App() {
  const [view, setView] = useState("vehicle");

  return (
    <div>
      <h1>Road Monitoring Dashboard</h1>

      <button onClick={() => setView("vehicle")}>Vehicle</button>
      <button onClick={() => setView("pothole")}>Pothole</button>
      <button onClick={() => setView("crack")}>Crack</button>
      <button onClick={() => setView("health")}>Road Health</button>

      {view === "vehicle" && <Vehicle />}
      {view === "pothole" && <Pothole />}
      {view === "crack" && <Crack />}
      {view === "health" && <Health />}
    </div>
  );
}
