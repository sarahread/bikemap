import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  // providers: [AuthService]
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  error: string;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }
  
  ngOnInit() {
  }

  async login() {
    this.error = null;
    
    try {
      const response: any = await this.http.post('auth/login', {
        username: this.username,
        password: this.password
      }).toPromise();
      console.log('token', response);
      this.auth.token = response.token;
    } catch (e) {
      this.error = e.error.msg;
    }
  }

}
