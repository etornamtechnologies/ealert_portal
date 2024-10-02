import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FuseSplashScreenService } from '@fuse/services/splash-screen/splash-screen.service';
import { AuthService } from '../auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router,
                private screenLoader: FuseSplashScreenService) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
              ): Observable<boolean> | Promise<boolean> | boolean {
        if (this.authService.isLoggedIn()) {
            if (state.url == '/xmobileadmin') {
                this.router.navigate(['/xmobileadmin/dashboard']);
            }
            return true;
        }else {
            this.screenLoader.show();
            if (this.authService.isUserKept()){
                const userCredentials = this.authService.getUserCredentials();
                if (userCredentials === null || undefined) {
                    this.router.navigate(['/auth/sign-in']);
                    return false;
                }
                this.authService.validateUser(userCredentials,false)
                .subscribe((response:any) => {
                    this.authService.setLogginStatus(response.data.token,response.data.user);
                    this.screenLoader.hide();
                    this.router.navigate([`${state.url}`]);
                    return true;
                },
                ()=> {
                    this.router.navigate(['/auth/sign-in']);
                    return false;
                });
            }else{
                this.router.navigate(['/auth/sign-in']);
                return false;
            }
        }
    }
}
