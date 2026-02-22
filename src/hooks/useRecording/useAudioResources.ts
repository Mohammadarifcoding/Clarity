import { useCallback, useRef } from "react";
import type { AudioResources } from "./types";
import {
  AUDIO_CONSTRAINTS,
  AUDIO_CONTEXT_CONFIG,
  floatTo16BitPCM,
} from "./audio.utils";

export interface UseAudioResourcesReturn {
  resourcesRef: React.MutableRefObject<AudioResources>;
  isPausedRef: React.MutableRefObject<boolean>;
  setupAudioStream: () => Promise<MediaStream>;
  setupAudioProcessor: (
    stream: MediaStream,
    onAudioData: (base64Audio: string) => void,
  ) => { audioContext: AudioContext; processor: ScriptProcessorNode };
  cleanupResources: () => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
}

export const useAudioResources = (): UseAudioResourcesReturn => {
  const resourcesRef = useRef<AudioResources>({
    websocket: null,
    mediaStream: null,
    audioContext: null,
    processor: null,
  });
  const isPausedRef = useRef<boolean>(false);

  const setupAudioStream = useCallback(async (): Promise<MediaStream> => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: AUDIO_CONSTRAINTS,
    });
    resourcesRef.current.mediaStream = stream;
    return stream;
  }, []);

  const setupAudioProcessor = useCallback(
    (
      stream: MediaStream,
      onAudioData: (base64Audio: string) => void,
    ): { audioContext: AudioContext; processor: ScriptProcessorNode } => {
      const audioContext = new AudioContext({
        sampleRate: AUDIO_CONTEXT_CONFIG.sampleRate,
      });
      resourcesRef.current.audioContext = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(
        AUDIO_CONTEXT_CONFIG.bufferSize,
        1,
        1,
      );
      resourcesRef.current.processor = processor;

      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        if (
          resourcesRef.current.websocket?.readyState === WebSocket.OPEN &&
          !isPausedRef.current
        ) {
          const inputData = e.inputBuffer.getChannelData(0);
          const base64Audio = floatTo16BitPCM(inputData);
          onAudioData(base64Audio);
        }
      };

      return { audioContext, processor };
    },
    [],
  );

  const cleanupResources = useCallback(() => {
    const { websocket, mediaStream, audioContext, processor } =
      resourcesRef.current;

    if (websocket) {
      websocket.close(1000, "Recording stopped");
      resourcesRef.current.websocket = null;
    }

    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      resourcesRef.current.mediaStream = null;
    }

    if (audioContext) {
      audioContext.close();
      resourcesRef.current.audioContext = null;
    }

    if (processor) {
      processor.disconnect();
      resourcesRef.current.processor = null;
    }
  }, []);

  const pauseAudio = useCallback(() => {
    isPausedRef.current = true;
  }, []);

  const resumeAudio = useCallback(() => {
    isPausedRef.current = false;
  }, []);

  return {
    resourcesRef,
    isPausedRef,
    setupAudioStream,
    setupAudioProcessor,
    cleanupResources,
    pauseAudio,
    resumeAudio,
  };
};
