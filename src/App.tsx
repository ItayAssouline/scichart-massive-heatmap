import { useState } from "react";
import "./App.css";
import TFChart from "./HeatmapChart/TFChart";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <TFChart />
    </div>
  );
}

export default App;
