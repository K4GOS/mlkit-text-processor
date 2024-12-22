import type { Frame } from 'react-native-vision-camera';

export type Block = {
  isJapanese: boolean;
  text: string;
  dimensions?: {
    height: number;
    width: number;
    x: number;
    y: number;
  };
};

export type TextRecognition = {
  getTextFromFrame: (frame: Frame) => Block[];
};
