import React, { useEffect, useRef } from "react";
import {
  HeatmapColorMap,
  MouseWheelZoomModifier,
  NonUniformHeatmapDataSeries,
  NonUniformHeatmapRenderableSeries,
  NumericAxis,
  SciChartSurface,
  UniformHeatmapDataSeries,
  UniformHeatmapRenderableSeries,
  ZoomExtentsModifier,
  ZoomPanModifier,
} from "scichart";
import { calculateSpectrogram } from "../utils/spectrogram.utils";
import { AcousticsAPI } from "./AcousticsAPI";

const TFChart: React.FC = () => {
  const audioRef = useRef<Float32Array | null>(null);
  const acousticsAPIRef = useRef(new AcousticsAPI());

  const onMount = async () => {
    if (!audioRef.current) {
      const response = await fetch("/egozi-full.wav");
      const arrayBuffer = await response.arrayBuffer();

      // Decode the audio file
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)({ sampleRate: 8000 });
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      console.log(audioBuffer);

      const audioData = audioBuffer.getChannelData(0);
      audioRef.current = audioData;
    }

    acousticsAPIRef.current.initialize(audioRef.current);
  };

  return (
    <>
      <button onClick={onMount}>TF</button>
      <div
        id="scichart-root"
        style={{ width: "1000px", height: "300px" }}
      ></div>
    </>
  );
};

export default TFChart;
