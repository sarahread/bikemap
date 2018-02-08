import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Trip } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}
  
  public get token(): string {
  	// TODO: This should work without localstorage, ie: private mode in safari
  	return window.localStorage.getItem('token') || '';
  }

  public set token(token: string) {
    if (token) {
      window.localStorage.setItem('token', token);
    } else {
      window.localStorage.removeItem('token');
    }
  }

  public get user(): string {
  	// TODO: This should work without localstorage, ie: private mode in safari
  	return JSON.parse(window.localStorage.getItem('user')) || '';
  }

  public set user(user: string) {
    if (user) {
      window.localStorage.setItem('user', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('user');
    }
  }

  public async login(username: string, password: string): Promise<any> {
    return await this.http.post('auth/login', {
      username,
      password
    }).toPromise().then((response: any) => {
      this.user = response.user;
      this.token = response.token;
    });
  }

  public async logout(): Promise<void> {
    this.token = null;
    this.user = null;
  }

  public async register(username: string, password: string): Promise<any> {
    return await this.http.post('auth/register', {
      username,
      password
    }).toPromise();
  }
}
