import { Component, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog,  MatDialogRef } from '@angular/material/dialog';
import {MatButton} from '@angular/material/button'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import{ AuthSignInComponent} from '../sign-in.component';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/core/auth/auth.service';
import { LoggedInUser } from 'app/shared/interfaces/auth.interface';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import swal from 'sweetalert2';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-token-dialog',
  templateUrl: './token-dialog.component.html',
  styleUrls: ['./token-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class TokenDialogComponent implements OnInit {

  tokenForm: FormGroup;
  showLoader:boolean = false;
  isTokenValid:boolean = false;
  // public details = '';

  @ViewChild('saveBtn') saveButton: MatButton;
  @ViewChild('cancelBtn') cancel: MatButton;
    static details: import("app/shared/interfaces/auth.interface").UserCredentials;
    

  constructor(
    public matDialogRef: MatDialogRef<TokenDialogComponent>,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private appLoader: FuseSplashScreenService,
    private renderer: Renderer2,
    private utilityApi: UtilityService,
    private authService: AuthService,
  ) { 
      this.tokenForm = this._formBuilder.group({
        token     : ['',Validators.required]
      });
    }

  ngOnInit() {}

  // validateToken(formData: FormGroup) : void
  // {
  //     if (formData.valid) 
  //     {
  //           this.showLoader = true; 
  //           this.renderer.setAttribute(this.saveButton._elementRef.nativeElement,'disabled','disabled');
  //           this.renderer.setAttribute(this.cancel._elementRef.nativeElement,'disabled','disabled');
            
  //           const tokenData = {
  //             username:TokenDialogComponent.details.username,
  //             password:TokenDialogComponent.details.password,
  //             token :  btoa(this.tokenForm.value.token.trim()),
  //           };
  //           this.authService.validateToken(tokenData).subscribe(response => { 
  //             console.log(response);
  //             if (response.access_token != "" || response.access_token != null || response.access_token) {

  //               let tempUser ={
  //                 username:response.data.user.username,
  //                 roleId:(response.data.user.roles[0].roleName).toUpperCase(),
  //                 fulName:response.data.user.username,
  //                 branch:response.data.user.branch.branchCode,
  //                 status:response.data.user.isApproved,
  //                 id:response.data.user.id,
  //                 lastLogin:response.data.user.lastLogin,//lastActivityDate,
  //                 all:response.data.user,
  //                 authStat:response.data.user.enabled,
  //             } 
  //             // return;
  //             // response.data.user;
  //             this.authService.setLogginStatus(response.data.accessToken,tempUser);
  //             window.location.href = '/ealert/dashboard';
                
  //             }else {
  //               this.appLoader.hide();
  //               // this.disableSignInButton = false;
  //               this.utilityApi.displayFailed(response.message,'Failed Login Process');
  //             }
  //           },()=>{
  //             this.showLoader = false;
  //             this.matDialogRef.close();
  //             this.utilityApi.displayError('Server Error! Unable to validate token.');
  //             this.authService.clearSession();
  //           });
  //      }
  // }

  validateToken(formData: FormGroup) : void
  {
      if (formData.valid) 
      {
            this.showLoader = true; 
            this.renderer.setAttribute(this.saveButton._elementRef.nativeElement,'disabled','disabled');
            this.renderer.setAttribute(this.cancel._elementRef.nativeElement,'disabled','disabled');
            
            const tokenData = {
              token : this.tokenForm.value.token.trim()
            };

            this.authService.validateToken(JSON.stringify(tokenData)).subscribe(response => { 
              if (response.status === 0) {
                this.isTokenValid = true;
                setTimeout(() => {
                  window.location.href = '/ealert/dashboard';
                }, 1000);
              }else {
                this.appLoader.hide();
                this.utilityApi.displayFailed(response.message,'Failed Login Process');
              }
            },()=>{
              this.showLoader = false;
              this.matDialogRef.close();
              this.utilityApi.displayError('Server Error! Unable to validate token.');
              this.authService.clearSession();
            });
       }
  }


  validateTokenTemporal(formData: FormGroup) : void
  {
      if (formData.valid) 
      {
        //window.location.href = '/ealert/dashboard';
            this.showLoader = true; 
            this.renderer.setAttribute(this.saveButton._elementRef.nativeElement,'disabled','disabled');
            this.renderer.setAttribute(this.cancel._elementRef.nativeElement,'disabled','disabled');
            
            const tokenData = {
              username:TokenDialogComponent.details.username,
              password:TokenDialogComponent.details.password,
              token :  btoa(this.tokenForm.value.token.trim()),
            };

            this.isTokenValid=true
                setTimeout(() => {
                  window.location.href = '/ealert/dashboard';
                }, 1500);

            // this.authService.validateToken(tokenData).subscribe(response => { 
            //   console.log(response);
            //   if (response.access_token != "" || response.access_token != null || response.access_token) {
            //     this.isTokenValid=true
            //     setTimeout(() => {
            //       window.location.href = '/ealert/dashboard';
            //     }, 1500);
            //   }else {
            //     this.showLoader = false;
            //     this.matDialogRef.close();
            //     this.authService.clearSession();
            //     this.utilityApi.displayFailed(response.message,'Failed Login Process');
            //     setTimeout(() => {
            //       window.location.href = '/ealert/sign-in';
            //     }, 1800);
            //   }
            // },()=>{
            //   this.showLoader = false;
            //   this.matDialogRef.close();
            //   this.utilityApi.displayError('Server Error! Unable to validate token.');
            //   this.authService.clearSession();
            // });
       }
  }


  // getuserdetails(access_token:any):void{
  //   let  user_new :any;
  //   this.authService.getUserData()
  //                   .subscribe((user:LoggedInUser) => {
                        
  //                       if (user!= null){
  //                           //encrypt when there is data coming.
  //                           user_new = btoa(<any>JSON.stringify(user));
  //                           // this.localStore.set('currentUser',user_new);
  //                           // this.localStore.set('token', access_token);
  //                           sessionStorage.setItem('currentUser',user_new);
  //                           sessionStorage.setItem('token', access_token);
  //                       }else{

  //                           //dont encrypt because it's empty 
  //                           this.localStore.set('currentUser', <any>JSON.stringify(user)); 
  //                       }

  //                       this.authService.setLogginStatus();
  //                       // this.appLoader.hide();
  //                   },
  //                   error => {
  //                       // this.appLoader.hide();
  //                       this.utilityApi.displayFailed(response.message,'Failed Login Process');
  //                   })
  // }

//   validateTokenTemporal(formData: FormGroup) : void
//   {
//       if (formData.valid) 
//       {
//         //window.location.href = '/ealert/dashboard';
//             this.showLoader = true; 
//             this.renderer.setAttribute(this.saveButton._elementRef.nativeElement,'disabled','disabled');
//             this.renderer.setAttribute(this.cancel._elementRef.nativeElement,'disabled','disabled');
            
//             const tokenData = {
//               username:TokenDialogComponent.details.username,
//               password:TokenDialogComponent.details.password,
//               token :  btoa(this.tokenForm.value.token.trim()),
//             };
//             this.authService.validateToken(tokenData).subscribe(response => { 
//               console.log(response);
//               if ( response.access_token && response.access_token != "" && response.access_token != null) {
//                 this.isTokenValid=true
//                 setTimeout(() => {
//                   window.location.href = '/ealert/dashboard';
//                 }, 1500);
//               }else {
//                 this.showLoader = false;
//                 this.matDialogRef.close();
//                 this.authService.clearSession();
//                 this.utilityApi.displayFailed(response.message,'Failed Login Process');
//                 setTimeout(() => {
//                   window.location.href = '/ealert/sign-in';
//                 }, 1800);
//               }
//             },()=>{
//               this.showLoader = false;
//               this.matDialogRef.close();
//               this.utilityApi.displayError('Server Error! Unable to validate token.');
//               this.authService.clearSession();
//             });
//        }
//   }


}
