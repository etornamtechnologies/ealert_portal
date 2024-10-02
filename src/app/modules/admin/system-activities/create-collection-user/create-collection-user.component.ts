import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilityService } from 'app/shared/services/utility.service';
import { ConfirmCollectionUserDetailsComponent } from './confirm-collection-user-details/confirm-collection-user-details.component';

@Component({
  selector: 'app-create-collection-user',
  templateUrl: './create-collection-user.component.html',
  styleUrls: ['./create-collection-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class CreateCollectionUserComponent implements OnInit {

  CreateUserForm: FormGroup;
  loggedInUsername:string;
  collections:any[] = [];
  dialogRef: MatDialogRef<ConfirmCollectionUserDetailsComponent>;

  constructor(
    private utilityApi: UtilityService, 
    private _formBuilder: FormBuilder,
    private splashScreen: FuseSplashScreenService,
    private _matDialog: MatDialog,
    private authService: AuthService
  ) {
      this.CreateUserForm = this._formBuilder.group({
        Firstname  : ['',Validators.required],
        Lastname   : ['',Validators.required],
        Mobile     : ['',Validators.required],
        Email      : ['',[Validators.required,Validators.email]],
        Username   : ['',Validators.required],
        Collection : ['',Validators.required]
      });
      this.loggedInUsername = this.authService.getLoggedInUserDetails().username;
    }

  ngOnInit(): void 
  {
    this.splashScreen.show();
    this.utilityApi.getCollections().subscribe(response => {
      if (response.errCode === 0) {
        this.collections = response.data.collections;
      }else {
        this.utilityApi.displayError('Unable to fetch collections');
      }
      this.splashScreen.hide();
    },()=>{
      this.splashScreen.hide();
      this.utilityApi.displayError('Unable to fetch collections');
    });
  }

  createUser(): void 
  {
    if (this.CreateUserForm.valid) {
      
      const userData = {
        firstname      : this.CreateUserForm.value.Firstname,
        email          : this.CreateUserForm.value.Email,
        collection     : this.CreateUserForm.value.Collection,
        createdBy      : this.loggedInUsername,
        lastname       : this.CreateUserForm.value.Lastname,
        phone          : this.CreateUserForm.value.Mobile,
        username       : this.CreateUserForm.value.Username
    }; 
    this.dialogRef = this._matDialog.open(ConfirmCollectionUserDetailsComponent,{
        data: {
          collectionUser : userData
        },
        width : '500px',
        disableClose: false
    });

    this.dialogRef.afterClosed().subscribe((result)=>{
      
      if(result === true) {
        this.splashScreen.show();
        this.utilityApi.createCollectionUser(JSON.stringify(userData)).subscribe(response => {
            this.splashScreen.hide();
            if (response.errCode === 0) {
              this.utilityApi.displaySuccessRedirect('User '+this.CreateUserForm.value.Firstname+ ' was successfully created.', 'xmobileadmin/system-activities/collection-users');
            }else {
              this.utilityApi.displayFailed(response.errMsg);
            }
          },(httpResponse) => {
            this.splashScreen.hide();
            this.utilityApi.displayFailed(httpResponse.error.error);
          });
        }
      });
    
    }
  }

}
