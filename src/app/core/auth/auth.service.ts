import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';

import { AppApiUrlsService } from 'app/shared/services/app-api-urls.service';
import { LoggedInUser, UserCredentials } from 'app/shared/interfaces/auth.interface';
import { CookieService } from 'ngx-cookie';
import { AppStore } from 'app/shared/localstorage-helper';
import CryptoJS from 'crypto-js';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private secretKey = "2F6f9Kn13cL7Ekbvt6f9Kn13cSicIt6vHFFa2NjVOYirt0es7UZM4Y0Urn6GwGd2";

  constructor(private http: HttpClient, private cookieService: CookieService) { }

    httpOptions = {
        headers: new HttpHeaders({
        'Content-Type' :  'application/json'
        })
    };

    validateUser (credentials: UserCredentials, storeCredentials: boolean):Observable<LoggedInUser>
    {
        if (storeCredentials) {
            this.keepUserLoggedIn(credentials);
        }else {
            this.cookieService.putObject(btoa('userKept'), false);
        }
        
        return this.http.post<LoggedInUser>(AppApiUrlsService.LOGIN, JSON.stringify(credentials), this.httpOptions)
        .pipe(
            retry(2),
            timeout(40000),
            catchError(this.responseErrorHandler)
        );
    }

    validateToken (token: any, ):Observable<any>
    {
        return this.http.post<any>(AppApiUrlsService.VALIDATE_TOKEN, token);
    }

    getAuthorizationToken(): string
    {
        return 'Bearer ' + AppStore.get('token');
    }

    isLoggedIn() : any 
    {
        const loggedInStatus = this.cookieService.getObject(btoa('MOBILEADMINauthUser'));
        return loggedInStatus ?? false;
    }

    clearSession() : void 
    {
        AppStore.remove('token');
        AppStore.remove('currentUser');
        AppStore.remove('editUserData');
        AppStore.remove('editCustomerData');
        AppStore.remove('editCollectionUserData');
        this.cookieService.remove(btoa('MOBILEADMINauthUser'));
        this.cookieService.remove(btoa('userCredentials'));
    }

    keepUserLoggedIn(credentials: UserCredentials) : void 
    {
        const cookieExpiration = new Date();
        cookieExpiration.setDate(cookieExpiration.getDate() + 90);
        const options = {
            expires : cookieExpiration,
            storeUnencoded : true,
            httpOnly  : false,
            secure    : false
        };
        const encryptedCredentials = this.encrypt(JSON.stringify(credentials));
        this.cookieService.putObject(btoa('userCredentials'),encryptedCredentials, options);
        this.cookieService.putObject(btoa('userKept'), true, options);
    }

    isUserKept(): boolean 
    {
        const userKeptStatus = <boolean>this.cookieService.getObject(btoa('userKept'));
        return userKeptStatus ?? false;
    }

    getUserCredentials(): any 
    {
        const encryptedCredentials = this.cookieService.getObject(btoa('userCredentials'));
        if(encryptedCredentials === undefined) {
            return null;
        }
        const decryptedCredentials = this.decrypt(encryptedCredentials.toString());
        return JSON.parse(decryptedCredentials);
    }

    getLoggedInUserDetails(): any 
    {
        return JSON.parse(AppStore.get('currentUser'));
    }

    setLogginStatus(token : string, user: any): void 
    {
        const cookieExpiration = new Date();
        cookieExpiration.setMinutes(cookieExpiration.getMinutes() + 180);
        const options = {
            expires : cookieExpiration,
            storeUnencoded : false,
            httpOnly  : false,
            secure    : false
        };
        this.cookieService.putObject(btoa('MOBILEADMINauthUser'), true, options);
        AppStore.set('token',token);
        AppStore.set('currentUser', JSON.stringify(user));
        console.log(user);
        
    }


    private responseErrorHandler(errorResponse: HttpErrorResponse | TimeoutError) {
        if (errorResponse instanceof HttpErrorResponse) 
        {
            if (errorResponse.status == 404) 
            {
                return throwError('Could not find a resource for your request.');
            }
            else if(errorResponse.status == 500 || errorResponse.status == 501)
            {
                return throwError('Internal server error, please contact administrator.');
            }
            else if (errorResponse.status == 0) 
            {
                return throwError('Network connectivity issue, either the remote server is unavailable or please check your computer connection.');
            }
            else 
            {
                return throwError('Invalid Username or Password.');
            }
        } 
        else
        {
            if (errorResponse instanceof TimeoutError)
             {
                return throwError(errorResponse.message);
             }
            return throwError('UNKNOWN CRITICAL ERROR OR A SYSTEM HIJACK PLEASE CONTACT YOUR VENDOR ASAP.');   
        }
      }

      resetUserPassword(userDetails : any) : Observable<any> 
      {
          return this.http.post<any>(AppApiUrlsService.FORGOT_PASSWORD,userDetails);
      }

      private encrypt(value : string) : string
      {
        return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
      }
    
      private decrypt(textToDecrypt : string)
      {
        return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
      }
}
