import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ChangePasswordComponent implements OnInit {

  ChangePasswordForm: FormGroup;

  constructor(
    private utilityApi: UtilityService, 
    private _formBuilder: FormBuilder,
    private splashScreen: FuseSplashScreenService,
    private confirmationDialog: FuseConfirmationService,
    public snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.ChangePasswordForm = this._formBuilder.group({
      OldPassword     : ['',Validators.required],
      NewPassword     : ['',[Validators.required,Validators.minLength(6)]],
      ConfirmPassword : ['',Validators.required]
    });
    }

  ngOnInit(): void 
  {
    
  }

  changeUserPassword(): void 
  {
    if (this.ChangePasswordForm.valid) 
    {
      if (this.ChangePasswordForm.value.NewPassword === this.ChangePasswordForm.value.ConfirmPassword) 
      {
        if(this.ChangePasswordForm.value.NewPassword !== this.ChangePasswordForm.value.OldPassword) 
        {

              const dialogRef = this.confirmationDialog.open({
                "title": "Confirm Password Change",
                "message": `<span class="text-lg font-normal">Proceed with password change process?</span>`,
                "icon": {
                  "show": true,
                  "name": "heroicons_outline:lock-closed",
                  "color": "info"
                },
                "actions": {
                  "confirm": {
                    "show": true,
                    "label": "Continue",
                    "color": "primary"
                  },
                  "cancel": {
                    "show": true,
                    "label": "Cancel"
                  }
                },
                "dismissible": true
              });
              console.log(this.authService.getLoggedInUserDetails().id);
        
              dialogRef.afterClosed().subscribe((result) => {
                if (result === 'confirmed')
                {
                  this.splashScreen.show();
                  const userId = this.authService.getLoggedInUserDetails().id;
                  const passwordObj = {
                    oldPassword     : this.ChangePasswordForm.value.OldPassword,
                    newPassword     : this.ChangePasswordForm.value.NewPassword, 
                    userId          : userId
                  };
                  this.utilityApi.changeAdminPassword(JSON.stringify(passwordObj)).subscribe(response => {
                    this.splashScreen.hide();
                    if (response.errCode === 0) {
                      this.utilityApi.displaySuccessRedirect('Password change was successful','/auth/sign-in');
                    }else {
                      this.utilityApi.displayFailed(response.errMsg);
                    }
                  },()=>{
                    this.splashScreen.hide();
                    this.utilityApi.displayFailed('Server error, unable to change password.');
                  });
                }
                
            });
        }else {
          this.snackBar.open('Old password and new password are the same.','OK',{duration: 4000});
        }   
      }else {
        this.snackBar.open('Password mistmach!','OK',{duration: 3000});
      }
    }
  }

}
