import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Language } from '../models/languages';
import { API } from '../config/api.config';
import { LanguageListResponse } from '../models/language-list-response';
import { CreateLanguageRequest } from '../models/create-language-request';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLanguages(): Observable<LanguageListResponse> {
    return this.http.get<LanguageListResponse>(`${this.apiUrl}/${API.language.list}`);
  }

  createLanguage(data: CreateLanguageRequest): Observable<Language> {
    return this.http.post<Language>(`${this.apiUrl}/${API.language.create}`, data);
  }

  getLanguage(id: number): Observable<Language> {
    return this.http.get<Language>(`${this.apiUrl}/${id}`);
  }

  updateLanguage(
    id: number,
    data: {
      name: string;
      code: string;
      native_name?: string;
      status: boolean;
    },
  ): Observable<Language> {
    return this.http.put<Language>(`${this.apiUrl}/${id}`, data);
  }

  deleteLanguage(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
