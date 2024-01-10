import React, { useEffect } from "react";
import {
  HeatmapColorMap,
  MouseWheelZoomModifier,
  NonUniformHeatmapDataSeries,
  NonUniformHeatmapRenderableSeries,
  NumericAxis,
  SciChartSurface,
  ZoomExtentsModifier,
  ZoomPanModifier,
} from "scichart";

const HeatmapChart: React.FC = () => {
  useEffect(() => {
    const runSciChart = async () => {
      const { wasmContext, sciChartSurface } = await SciChartSurface.create(
        "scichart-root"
      );

      const lengthOnX = 28125;
      const lengthOnY = 1025;

      sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
      sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

      const heatmapData = generateHeatmapData(lengthOnX, lengthOnY); // 8 columns, 5 rows
      const xRangeOffsetsSource: number[] = [];
      for (let i = 0; i <= heatmapData[0].length; i++) {
        xRangeOffsetsSource.push((i * lengthOnX) / 4096);
      }
      const yRangeOffsetsSource: number[] = Array(heatmapData.length + 1)
        .fill(0)
        .map((_, i) => i);

      const heatmapSeries = new NonUniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: new NonUniformHeatmapDataSeries(wasmContext, {
          // 2d zValues array. Dimensions [height][width]
          zValues: heatmapData,
          // xStart, xStep, yStart, yStep defines the x,y position
          xCellOffsets: xRangeOffsetsSource,
          yCellOffsets: yRangeOffsetsSource,
        }),

        colorMap: new HeatmapColorMap({
          minimum: 0,
          maximum: 100,
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

    runSciChart();
  }, []);

  return (
    <div id="scichart-root" style={{ width: "800px", height: "300px" }}></div>
  );
};

function generateHeatmapData(width: number, height: number): number[][] {
  const zValues: number[][] = new Array(height);
  for (let y = 0; y < height; y++) {
    zValues[y] = new Array(width);
    for (let x = 0; x < width; x++) {
      zValues[y][x] = Math.random() * 100; // Random data
    }
  }
  return zValues;
}

export default HeatmapChart;
