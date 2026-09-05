import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Item } from '../models/item';
import { API } from '../config/api.config';
import { ItemListResponse } from '../models/item-list-response';
import { CreateItemRequest } from '../models/create-item-request';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getItems(
    page: number = 1,
    search: string = '',
    perPage: number = 10,
  ): Observable<ItemListResponse> {
    return this.http.get<ItemListResponse>(
      `${this.apiUrl}/${API.item.list}?search=${search}&page=${page}&per_page=${perPage}`,
    );
  }

  // getItem(id: number): Observable<Item> {
  //   return this.http.get<Item>(`${this.apiUrl}/${API.item.item}/${id}`);
  // }

  createItem(formData: FormData) {
    return this.http.post(`${this.apiUrl}/${API.item.create}`, formData);
  }

  updateItem(id: number, formData: FormData) {
    return this.http.post(`${this.apiUrl}/${API.item.update}/${id}`, formData);
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${API.item.destroy}/${id}`);
  }
}
