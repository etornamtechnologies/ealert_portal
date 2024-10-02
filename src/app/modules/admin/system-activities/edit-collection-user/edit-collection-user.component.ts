import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { AppStore } from 'app/shared/localstorage-helper';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-edit-collection-user',
  templateUrl: './edit-collection-user.component.html',
  styleUrls: ['./edit-collection-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class EditCollectionUserComponent implements OnInit {

  EditUserForm: FormGroup;
  loggedInUsername:string;
  collections:any[] = [];
  user:any;
  
  constructor(
    private utilityApi: UtilityService, 
    private _formBuilder: FormBuilder,
    private splashScreen: FuseSplashScreenService,
    private authService: AuthService
  ) {
      this.user = JSON.parse(AppStore.get('editCollectionUserData'));
      this.EditUserForm = this._formBuilder.group({
        Firstname  : [this.user.firstname,Validators.required],
        Lastname   : [this.user.lastname,Validators.required],
        Mobile     : [this.user.phone,Validators.required],
        Email      : [this.user.email,[Validators.required,Validators.email]],
        Username   : [this.user.username,Validators.required],
        Collection : [this.user.collectionType,Validators.required]
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

    editUser(): void 
    {
      if (this.EditUserForm.valid) {
        
        const userData = {
          id             : this.user.id,
          firstname      : this.EditUserForm.value.Firstname,
          email          : this.EditUserForm.value.Email,
          collection     : this.EditUserForm.value.Collection,
          createdBy      : this.loggedInUsername,
          lastname       : this.EditUserForm.value.Lastname,
          phone          : this.EditUserForm.value.Mobile,
          username       : this.EditUserForm.value.Username
      };

      this.splashScreen.show();
      this.utilityApi.updateCollectionUser(JSON.stringify(userData)).subscribe(response => {
          this.splashScreen.hide();
              if (response.errCode === 0) {
                this.utilityApi.displaySuccessRedirect('User '+this.EditUserForm.value.Firstname+ ' was successfully modified.', 'xmobileadmin/system-activities/collection-users');
              }else {
                this.utilityApi.displayFailed(response.errMsg);
              }
            },(httpResponse) => {
              this.splashScreen.hide();
              this.utilityApi.displayFailed(httpResponse.error.error);
            });
      
      }
    }

}
