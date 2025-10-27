import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private accessTokenKey = 'access_token';

  constructor() {}

  setToken(token: string) {
    localStorage.setItem(this.accessTokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  removeToken() {
    localStorage.removeItem(this.accessTokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
