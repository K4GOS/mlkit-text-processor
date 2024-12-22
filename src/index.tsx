import MlkitTextProcessor from './NativeMlkitTextProcessor';

export const {
  recognizeTextFromUri,
  translateText,
  translateJapaneseText,
  uninstallLanguageModel,
  getDownloadedTranslationModels,
} = MlkitTextProcessor;

export { useTextRecognition } from './TextRecognition';
