import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import HeatmapChart from "./HeatmapChart/HeatmapChart";
import MagentaChart from "./HeatmapChart/MagentaChart";
import TFChart from "./HeatmapChart/TFChart";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <TFChart />
      {/* <HeatmapChart /> */}
      {/* <MagentaChart /> */}
    </div>
  );
}

export default App;
