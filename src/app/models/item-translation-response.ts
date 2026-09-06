import { ItemLanguageMapping } from './item-language-mapping';

export interface ItemTranslationResponse {
  success: boolean;
  message: string;
  data: {
    data: ItemLanguageMapping[];
  };
}
