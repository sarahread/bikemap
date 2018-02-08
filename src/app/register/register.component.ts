import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  username: string;
  password: string;
  error: string;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  async register() {
    this.error = null;
    
    this.auth.register(this.username, this.password).then((response) => {
      console.log('auth service response', response);
    });
  }
}
