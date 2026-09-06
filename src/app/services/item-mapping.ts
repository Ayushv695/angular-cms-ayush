import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Item } from '../models/item';
import { Language } from '../models/languages';
import { ItemLanguageMapping } from '../models/item-language-mapping';
import { API } from '../config/api.config';
import { AllItemsListResponse } from '../models/all-items-list-response';
import { ItemTranslationResponse } from '../models/item-translation-response';

@Injectable({
  providedIn: 'root',
})
export class ItemMappingService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // Get all items
  getItems(): Observable<AllItemsListResponse> {
    return this.http.get<AllItemsListResponse>(`${this.apiUrl}/${API.item.allItemsList}`);
  }

  // Get all languages
  // getLanguages(): Observable<Language[]> {
  //   return this.http.get<Language[]>(`${this.apiUrl}/languages`);
  // }

  // Get mappings for selected item
  getMappings(itemId: number): Observable<ItemTranslationResponse> {
    return this.http.get<ItemTranslationResponse>(`${this.apiUrl}/${API.mapping.list}/${itemId}`);
  }

  // Add mapping
  createMapping(
    itemId: number,
    languageId: number,
    name: string,
    audio: File | null,
  ): Observable<any> {
    const formData = new FormData();

    formData.append('item_id', itemId.toString());
    formData.append('language_id', languageId.toString());
    formData.append('name', name);

    if (audio) {
      formData.append('audio', audio);
    }

    return this.http.post<any>(`${this.apiUrl}/${API.mapping.create}`, formData);
  }

  // Update mapping
  updateMapping(
    id: number,
    itemId: number,
    languageId: number,
    name: string,
    audio: File | null,
  ): Observable<any> {
    const formData = new FormData();

    formData.append('item_id', itemId.toString());
    formData.append('language_id', languageId.toString());
    formData.append('name', name);
    formData.append('_method', 'PUT');

    if (audio) {
      formData.append('audio', audio);
    }

    return this.http.post<any>(`${this.apiUrl}/${API.mapping.update}/${id}`, formData);
  }

  // Delete mapping
  deleteMapping(mappingId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${API.mapping.destroy}/${mappingId}`);
  }
}
