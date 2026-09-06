export interface ItemLanguageMapping {
  id: number;
  item_id: number;
  item_name: string;
  language_id: number;
  language_name: string;
  language_code: string;
  translated_name: string;
  translated_audio: string | null;
}
