/**
 * Convert Float32Array audio data to base64 encoded PCM16
 */
export const floatTo16BitPCM = (float32Array: Float32Array): string => {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const uint8Array = new Uint8Array(int16Array.buffer);
  return btoa(String.fromCharCode(...uint8Array));
};

/**
 * Audio constraints for optimal speech recording
 */
export const AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  sampleRate: 24000,
  channelCount: 1,
};

/**
 * Audio context configuration
 */
export const AUDIO_CONTEXT_CONFIG = {
  sampleRate: 24000,
  bufferSize: 4096,
};
