import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  auth = this.authService;
  private username: string;
  private password: string;
  private error: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }
  
  ngOnInit() {
  }

  async login() {
    this.error = null;
    
    this.auth.login(this.username,  this.password).catch(e => {
      this.error = e.error.msg;
    });
  }

}
