import { ItemLanguageMapping } from './item-language-mapping';
import { Language } from './languages';

export interface ItemTranslationResponse {
  success: boolean;
  message: string;
  data: {
    translations: {
      data: ItemLanguageMapping[];
    };
    languages_available_for_mapping: Language[];
  };
}
