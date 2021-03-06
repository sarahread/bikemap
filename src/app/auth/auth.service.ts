import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Trip } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {
    this.refreshUser();
  }
  
  public user: any;

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

  public async refreshUser(): Promise<any> {
    this.user = JSON.parse(window.localStorage.getItem('user')) || '';
    
    if (!this.user) {
      this.user = await this.http.get('auth/user').toPromise();
      window.localStorage.setItem('user', JSON.stringify(this.user));
    }
  }

  public async login(username: string, password: string): Promise<any> {
    return await this.http.post('auth/login', {
      username,
      password
    }).toPromise().then((response: any) => {
      this.token = response.token;
      this.refreshUser();
    });
  }

  public async logout(): Promise<void> {
    this.token = null;
    this.user = null;
    window.localStorage.removeItem('user');
    window.location.reload();
  }

  public async register(username: string, password: string): Promise<any> {
    return await this.http.post('auth/register', {
      username,
      password
    }).toPromise();
  }
}
