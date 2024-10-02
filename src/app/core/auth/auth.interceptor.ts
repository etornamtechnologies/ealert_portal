import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService){}

    intercept (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.auth.getAuthorizationToken();
        const url = request.urlWithParams;
        if (url.includes('/login',0)){
            const noAuthRequest = request.clone({headers : new HttpHeaders({
                     'Content-Type' :  'application/json'
                })});
            return next.handle(noAuthRequest);
        }

        if (url.includes('/passwordReset',0)){
            const noAuthRequest = request.clone({headers : new HttpHeaders({
                     'Content-Type' :  'application/json'
                })});
            return next.handle(noAuthRequest);
        }

        if (url.includes('/upload',0)){
            
            const AuthRequest = request.clone({setHeaders : { Authorization : token}});
            return next.handle(AuthRequest);
        }

        const authRequest = request.clone({
            setHeaders : { Authorization : token},
            headers : new HttpHeaders({
                'Content-Type' :  'application/json'
           })
        });
        
        return next.handle(authRequest);
    }
}