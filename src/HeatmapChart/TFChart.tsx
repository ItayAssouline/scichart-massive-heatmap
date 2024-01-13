import React, { useEffect } from "react";
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

import * as tf from "@tensorflow/tfjs";

function transposeArray(array: number[][]) {
  return array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
}

const TFChart: React.FC = () => {
  const a = async () => {
    const response = await fetch("/audio2.mp3");
    const arrayBuffer = await response.arrayBuffer();

    // Decode the audio file
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const audioData = audioBuffer.getChannelData(0);
    const audioTensor = tf.tensor1d(audioData);

    // tf.signal.stft applies a Hann window internally
    // frameLength and frameStep can be adjusted based on your requirements
    const fftLength = 8192;
    const frameLength = fftLength;
    const frameStep = frameLength / 2;

    // Compute the STFT - Windowing happens here
    const stft = await tf.signal.stft(
      audioTensor,
      frameLength,
      frameStep,
      fftLength
    );

    // Compute the magnitude (spectrogram)
    const magnitude = await tf.abs(stft);

    // Optional: Convert to logarithmic scale
    const spectrogram = await magnitude.log();

    const specArr = await spectrogram.array();
    const specMapped = transposeArray(specArr);
    const data = specMapped;
    console.log(data);

    // SCICHART

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(
      "scichart-root"
    );

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
      dataSeries: new UniformHeatmapDataSeries(wasmContext, {
        // 2d zValues array. Dimensions [height][width]
        zValues: data,
        // xStart, xStep, yStart, yStep defines the x,y position
        xStart: 0,
        xStep: 1,
        yStart: 0,
        yStep: 1,
      }),

      colorMap: new HeatmapColorMap({
        minimum: -15,
        maximum: 10,
        gradientStops: [
          { offset: 1, color: "#EC0F6C" },
          { offset: 0.9, color: "#F48420" },
          { offset: 0.7, color: "#DC7969" },
          { offset: 0.5, color: "#67BDAF" },
          { offset: 0.3, color: "#50C7E0" },
          { offset: 0.2, color: "#264B93" },
          { offset: 0, color: "#14233C" },
        ],
      }),
    });

    sciChartSurface.renderableSeries.add(heatmapSeries);
    sciChartSurface.chartModifiers.add(
      new ZoomPanModifier(),
      new MouseWheelZoomModifier(),
      new ZoomExtentsModifier()
    );
  };

  // useEffect(() => {
  //   const runSciChart = async () => {
  //     const audioLoader = new Essentia(EssentiaWASM);

  //     const { wasmContext, sciChartSurface } = await SciChartSurface.create(
  //       "scichart-root"
  //     );

  //     sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  //     sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  //     const heatmapData = [
  //       [1, 2, 3, 4],
  //       [4, 3, 2, 1],
  //       [1, 2, 3, 4],
  //     ]; // 8 columns, 5 rows

  //     const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
  //       dataSeries: new UniformHeatmapDataSeries(wasmContext, {
  //         // 2d zValues array. Dimensions [height][width]
  //         zValues: heatmapData,
  //         // xStart, xStep, yStart, yStep defines the x,y position
  //         xStart: 0,
  //         xStep: 1,
  //         yStart: 0,
  //         yStep: 1,
  //       }),

  //       colorMap: new HeatmapColorMap({
  //         minimum: 0,
  //         maximum: 4,
  //         gradientStops: [
  //           { offset: 1, color: "#EC0F6C" },
  //           { offset: 0.9, color: "#F48420" },
  //           { offset: 0.7, color: "#DC7969" },
  //           { offset: 0.5, color: "#67BDAF" },
  //           { offset: 0.3, color: "#50C7E0" },
  //           { offset: 0.2, color: "#264B93" },
  //           { offset: 0, color: "#14233C" },
  //         ],
  //       }),
  //     });

  //     sciChartSurface.renderableSeries.add(heatmapSeries);
  //     sciChartSurface.chartModifiers.add(
  //       new ZoomPanModifier(),
  //       new MouseWheelZoomModifier(),
  //       new ZoomExtentsModifier()
  //     );
  //   };

  //   runSciChart();
  // }, []);

  // useEffect(() => {
  //   const essentia = new Essentia(Essentia.EssentiaWASM);
  // }, []);
  return (
    <>
      <button onClick={a}>TF</button>
      <div id="scichart-root" style={{ width: "800px", height: "300px" }}></div>
    </>
  );
};

export default TFChart;
