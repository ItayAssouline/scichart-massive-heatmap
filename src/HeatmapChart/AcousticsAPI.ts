import {
  EAutoRange,
  HeatmapColorMap,
  MouseWheelZoomModifier,
  NumberRange,
  NumericAxis,
  SciChartSurface,
  UniformHeatmapDataSeries,
  UniformHeatmapRenderableSeries,
  VisibleRangeChangedArgs,
  ZoomExtentsModifier,
  ZoomPanModifier,
} from "scichart";
import { calculateSpectrogram } from "../utils/spectrogram.utils";

export class AcousticsAPI {
  /**
   *
   */
  constructor() {}

  private _heatmapSeries?: UniformHeatmapDataSeries;
  private get heatmapSeries() {
    if (!this._heatmapSeries)
      throw new Error("Tried accessing heatmapSeries before initialized");
    return this._heatmapSeries;
  }

  private _audio?: Float32Array;
  private get audio() {
    if (!this._audio)
      throw new Error("Tried accessing audio before initialized");
    return this._audio;
  }

  private _xAxis?: NumericAxis;
  private get xAxis() {
    if (!this._xAxis)
      throw new Error("Tried accessing xAxis before initialized");
    return this._xAxis;
  }

  public async initialize(audioBuffer: Float32Array) {
    this._audio = audioBuffer;
    const data = await calculateSpectrogram(this._audio, 10);

    // SCICHART

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(
      "scichart-root"
    );

    this._xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(this.xAxis);

    this.xAxis.visibleRange = new NumberRange(0, audioBuffer.length);
    this.xAxis.visibleRangeLimit = new NumberRange(0, audioBuffer.length);

    const deb = debounce(
      (data: VisibleRangeChangedArgs) => this.onRangeChange(data),
      300
    );
    // xAxis.visibleRangeChanged.subscribe(this.onRangeChange);
    this.xAxis.visibleRangeChanged.subscribe(deb);

    const yAxis = new NumericAxis(wasmContext, {
      autoRange: EAutoRange.Always,
    });
    sciChartSurface.yAxes.add(yAxis);

    this._heatmapSeries = new UniformHeatmapDataSeries(wasmContext, {
      zValues: data,
      xStart: 0,
      xStep: audioBuffer.length / data[0].length,
      yStart: 0,
      yStep: 1,
    });

    const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
      dataSeries: this.heatmapSeries,

      colorMap: new HeatmapColorMap({
        minimum: -5,
        maximum: 5,
        gradientStops: [
          { offset: 0.0, color: "#000004" },
          { offset: 0.16666666666666666, color: "#320a5e" },
          { offset: 0.3333333333333333, color: "#781c6d" },
          { offset: 0.5, color: "#bc3754" },
          { offset: 0.6666666666666666, color: "#ed6925" },
          { offset: 0.8333333333333334, color: "#fbb61a" },
          { offset: 1.0, color: "#fcffa4" },
        ],
      }),
    });

    sciChartSurface.renderableSeries.add(heatmapSeries);
    sciChartSurface.chartModifiers.add(
      new ZoomPanModifier(),
      new MouseWheelZoomModifier(),
      new ZoomExtentsModifier()
    );
  }

  private onRangeChange = async (data: VisibleRangeChangedArgs) => {
    console.log("Range has changed!");

    const { visibleRange } = data;
    const newData = await calculateSpectrogram(
      this.audio.slice(visibleRange.min, visibleRange.max),
      (visibleRange.max - visibleRange.min) / 200000
    );
    this.heatmapSeries.setZValues(newData);
    this.heatmapSeries.xStart = visibleRange.min;
    this.heatmapSeries.xStep =
      (visibleRange.max - visibleRange.min) / newData[0].length;
    // this.xAxis.visibleRange = new NumberRange(
    //   this.xAxis.visibleRange.min,
    //   this.xAxis.visibleRange.max
    // );
    // this.xAxis.visibleRangeLimit = new NumberRange(0, newData[0].length);
  };
}

function debounce<T extends (...args: any[]) => any>(func: T, waitFor: number) {
  let timeout: number | undefined;

  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), waitFor);
  };
}
