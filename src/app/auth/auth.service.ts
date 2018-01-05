import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  public get token(): string {
  	// TODO: This should work without localstorage, ie: private mode in safari
  	return window.localStorage.getItem('token') || '';
  }

  public set token(token: string) {
  	window.localStorage.setItem('token', token);
  }

  public async login(username: string, password: string): Promise<void> {
  	// TODO
  }

  public async logout(): Promise<void> {
  	// TODO
  }

  public async register(): Promise<void> {
  	// TODO
  }

}
