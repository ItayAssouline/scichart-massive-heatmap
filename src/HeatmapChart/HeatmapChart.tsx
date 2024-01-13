import * as esPkg from "essentia.js";
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

// import * as esPkg from "essentia.js";

const HeatmapChart: React.FC = () => {
  const a = async () => {
    console.log(esPkg);
    const essentia = new esPkg.Essentia(esPkg.EssentiaWASM.EssentiaWASM);

    const response = await fetch("/audio.mp3");
    const arrayBuffer = await response.arrayBuffer();

    // Decode the audio file
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    let audioVector = essentia.arrayToVector(audioBuffer.getChannelData(0));

    const extractor = new esPkg.EssentiaExtractor(
      esPkg.EssentiaWASM.EssentiaWASM
    );

    const spectrum = essentia.Spectrum(audioVector, 8192);
    console.log(spectrum);

    // console.log(melSpectrum);

    // const spectralExtractor = new essentia.MelSpectrumExtractor();

    // let melSpectrum = spectralExtractor.compute(audioVector);
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
      <button onClick={a}>aaaa</button>
      <div id="scichart-root" style={{ width: "800px", height: "300px" }}></div>
    </>
  );
};

export default HeatmapChart;
