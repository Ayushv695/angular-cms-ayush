import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../models/login-response';
import { User } from '../models/user';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { API } from '../config/api.config';
import { LogoutResponse } from '../models/logout-response';
import { RefreshTokenResponse } from '../models/refresh-token-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/${API.auth.login}`, {
      email: email,
      password: password,
    });
  }

  register(
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    role: string,
  ) {
    return this.http.post<any>(`${this.apiUrl}/${API.auth.register}`, {
      name: name,
      email: email,
      password: password,
      password_confirmation: passwordConfirmation,
      role: role,
    });
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    return this.http.post<RefreshTokenResponse>(`${this.apiUrl}/${API.auth.refresh}`, {});
  }

  logout(): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(`${this.apiUrl}/${API.auth.logout}`, {});
  }

  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  setData(response: any) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  isAdmin(): boolean {
    return this.getUser()?.role === 'admin';
  }

  isManager(): boolean {
    return this.getUser()?.role === 'manager';
  }
}
