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
  addMapping(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/item-mappings`, formData);
  }

  // Update mapping
  updateMapping(mappingId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/item-mappings/${mappingId}`, formData);
  }

  // Delete mapping
  deleteMapping(mappingId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/item-mappings/${mappingId}`);
  }
}
