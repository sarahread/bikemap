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
  error: string;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  async register() {
    this.error = null;
    
    try {
      await this.http.post('auth/register', {
        username: this.username,
        password: this.password
      }).toPromise();

      // TODO: Do something after logging in
    } catch (e) {
      this.error = e.error.msg;
    }  }
}
