import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  username: string;
  password: string;
  result: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  async register() {
    this.result = await this.http.post('auth/register', {
      username: this.username,
      password: this.password
    }).toPromise();
}
