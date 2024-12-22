import { useMemo } from 'react';
import { VisionCameraProxy, type Frame } from 'react-native-vision-camera';
import type { Block, TextRecognition } from './Types';

function createTextRecognitionPlugin(): any {
  const plugin = VisionCameraProxy.initFrameProcessorPlugin(
    'getTextFromFrame',
    {}
  );
  if (!plugin) {
    throw new Error('LINKING_ERROR: no plugin scanText detected');
  }
  return {
    getTextFromFrame: (frame: Frame): Block[] => {
      'worklet';
      // @ts-ignore
      return plugin.call(frame) as Block[];
    },
  };
}

export function useTextRecognition(): TextRecognition {
  return useMemo(() => createTextRecognitionPlugin(), []);
}
