import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  auth: AuthService;

  constructor(private injector: Injector) {
    setTimeout(() => { // Prevent cyclic dependency / call stack issues
      this.auth = injector.get(AuthService);
    }, 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authHeader = this.auth.token;
    console.log('authheader', authHeader);
    const authReq = req.clone({ headers: req.headers.set('Authorization', authHeader) });

    return next.handle(authReq).catch(error => {
      if (error.status == 401) {
        this.auth.logout();
      }
      
      return Observable.throw(error);
    });
  }
  
  
}