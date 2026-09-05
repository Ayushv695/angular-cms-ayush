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

  getLanguages(page: number = 1): Observable<LanguageListResponse> {
    return this.http.get<LanguageListResponse>(`${this.apiUrl}/${API.language.list}?page=${page}`);
  }

  createLanguage(data: CreateLanguageRequest): Observable<Language> {
    return this.http.post<Language>(`${this.apiUrl}/${API.language.create}`, data);
  }

  updateLanguage(id: number, language: CreateLanguageRequest): Observable<Language> {
    return this.http.put<Language>(`${this.apiUrl}/${API.language.update}/${id}`, language);
  }

  deleteLanguage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${API.language.destroy}/${id}`);
  }
}
