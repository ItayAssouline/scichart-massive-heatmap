import * as tf from "@tensorflow/tfjs";

export const calculateSpectrogram = async (
  audioBuffer: Float32Array,
  hopSizeMultiplicator: number
) => {
  const audioTensor = tf.tensor1d(audioBuffer);

  // tf.signal.stft applies a Hann window internally
  // frameLength and frameStep can be adjusted based on your requirements
  const fftLength = 360;
  const frameLength = fftLength;
  const frameStep = frameLength * 0.5 * hopSizeMultiplicator;

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
  return specMapped;
};

function transposeArray(array: number[][]) {
  return array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
}
