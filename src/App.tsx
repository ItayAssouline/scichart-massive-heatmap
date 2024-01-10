import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import HeatmapChart from "./HeatmapChart/HeatmapChart";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <HeatmapChart />
    </div>
  );
}

export default App;
