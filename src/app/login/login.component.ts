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
  result: any;

  constructor(private http: HttpClient) { }
  
  ngOnInit() {
  }

  async login() {
    this.result = await this.http.post('auth/login', {
      username: this.username,
      password: this.password
    }).toPromise();
  }

}
