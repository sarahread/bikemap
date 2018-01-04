import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  error: string;

  constructor(private http: HttpClient) { }
  
  ngOnInit() {
  }

  async login() {
    this.error = null;
    
    try {
      await this.http.post('auth/login', {
        username: this.username,
        password: this.password
      }).toPromise();

      // TODO: Do something after logging in
    } catch (e) {
      this.error = e.error.msg;
    }
  }

}
