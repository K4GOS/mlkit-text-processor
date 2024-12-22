import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

// import type { Frame } from 'react-native-vision-camera';

export interface Spec extends TurboModule {
  recognizeTextFromUri: (uri: string) => string[];
  translateText(japaneseText: string, targetLanguage: string): string;
  translateJapaneseText(
    japaneseText: string,
    targetLanguage: string
  ): Promise<string>;
  getDownloadedTranslationModels(): Promise<string[]>;
  uninstallLanguageModel(targetLanguage: string): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('MlkitTextProcessor');
