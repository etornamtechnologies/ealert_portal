import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { UserCredentials } from 'app/shared/interfaces/auth.interface';
import { UtilityService } from 'app/shared/services/utility.service';
import { TokenDialogComponent } from './token-dialog/token-dialog.component';

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    styleUrls    : ['./sign-in.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit
{

    signInForm: FormGroup;
    disableSignInButton : boolean = false;
    dialogRef: MatDialogRef<TokenDialogComponent>;


    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private appLoader: FuseSplashScreenService,
        private authService: AuthService,
        private utilityApi: UtilityService,
        private _matDialog: MatDialog,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signInForm = this._formBuilder.group({
            username   : ['', [Validators.required, Validators.minLength(2)]],
            password   : ['', Validators.required],
            remember   : this.authService.isUserKept()
        });
        this.authService.clearSession();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signInValidation(): void
    {
        // Return if the form is invalid
        if (this.signInForm.invalid)
        {
            return;
        }
        this.appLoader.show();
        this.disableSignInButton = true;
        const username = this.signInForm.value.username.trim();
        const password = this.signInForm.value.password.trim();
        const remember = this.signInForm.value.remember;
        const userCredentials: UserCredentials = {
            username:username,
            password:password
        };
        JSON.stringify(userCredentials);

        //by pass login starting
        // this.authService.setLogginStatus('9999999',{'username':'GHCLEARING','branch':'000','roleId':'ALLROLES'});
        // this.appLoader.hide();
        // TokenDialogComponent.details = userCredentials;
        // this.dialogRef = this._matDialog.open(TokenDialogComponent,{
        //         width : '450px',
        //         disableClose: false
        //     });
        // this.dialogRef.afterClosed().subscribe(result =>{
        //         this.disableSignInButton = false;
        // })                        
        //by pass login Ending
        
        this.authService.validateUser(userCredentials, remember)
        .subscribe((response: any) => {
            if (response.code === 200) {
                // return;
                let tempUser ={
                    username:response.data.user.username,
                    roleId:(response.data.user.role.name).toUpperCase(),
                    fulName:response.data.user.username,
                    branch:response.data.user.branch,
                    status:response.data.user.isApproved,
                    id:response.data.user.id,
                    lastLogin:response.data.user.lastLogin,//lastActivityDate,
                    all:response.data.user,
                    authStat:response.data.user.enabled,
                } 
                
                this.authService.setLogginStatus(response.data.accessToken,tempUser);
                this.appLoader.hide();
                this.disableSignInButton = false;
                TokenDialogComponent.details = userCredentials;
                    // this.dialogRef = this._matDialog.open(TokenDialogComponent,{
                    //         width : '450px',
                    //         disableClose: true
                    //     });
                window.location.href = '/ealert/dashboard';
            }else{
                this.appLoader.hide();
                this.disableSignInButton = false;
                this.utilityApi.displayFailed(response.message,'Failed Login Process');
            }
        },(error) => {
                this.appLoader.hide();
                this.disableSignInButton = false;
                this.utilityApi.displayFailed(error,'Failed Login Process');
        });
    }
}


