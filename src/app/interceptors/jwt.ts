import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authHeader = this.auth.token;
    const authReq = req.clone({ headers: req.headers.set('Authorization', authHeader) });

    return next.handle(authReq);
  }
  
  // TODO: Handle 401 errors and invalidate token
}