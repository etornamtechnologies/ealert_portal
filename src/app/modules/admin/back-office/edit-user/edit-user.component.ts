import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { AppStore } from 'app/shared/localstorage-helper';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class EditUserComponent implements OnInit {

  EditUserForm: FormGroup;
  branch:string;
  loggedInUsername:string;
  user:any;
  role:string;
  roles:any[];
  branches:any[];
  departments:any[];
  
  constructor(
    private utilityApi: UtilityService, 
    private _formBuilder: FormBuilder,
    private splashScreen: FuseSplashScreenService,
    private authService: AuthService
  ) {
      this.user = JSON.parse(AppStore.get('editUserData'));
      console.log(this.user);
      console.log('edit user data', this.user)
      this.EditUserForm = this._formBuilder.group({
        FullName  : [this.user.fullname,Validators.required],
        Department: [this.user.department?.id],
        // Email      : [this.user.emailAddress,[Validators.required,Validators.email]],
        UserRole   : [this.user.role?.id,Validators.required],
        Username   : [this.user.username,Validators.required],
        Branch     : [this.user.branch,Validators.required]
      });
      this.role = this.authService.getLoggedInUserDetails().roleId;
      this.loggedInUsername = this.authService.getLoggedInUserDetails().username;
    }

  ngOnInit(): void 
  {
    // to featch branches 
    this.splashScreen.show();
    this.utilityApi.getBranches().subscribe(response => {
      console.log(response);
      if (response.code === 200) {
        this.branches = response.data;
      }else {
        this.utilityApi.displayError('Unable to fetch branches');
      }
      this.splashScreen.hide();
    },()=>{
      this.splashScreen.hide();
      this.utilityApi.displayError('Unable to fetch branches');
    });
    // end branch featching


    // get all roles in the system 
    this.utilityApi.getRoles().subscribe(response => {
      console.log(response);
      if (response.code === 200) {
        this.roles = response.data;
        // this.roles.forEach((role)=>this.filteredBranches.push(role));
        // this.CreateUserForm.get('UserRole').valueChanges.subscribe((value)=>this._filter(value));
      }else {
        this.utilityApi.displayError('Unable to fetch roles');
      }
      this.splashScreen.hide();
    },()=>{
      this.splashScreen.hide();
      this.utilityApi.displayError('Unable to fetch roles');
    });
    // end of getting all roles in the system
    

     // get all department in the system 
     this.utilityApi.getDepartments().subscribe(response => {
      console.log(response);
      if (response.code === 200) {
        this.departments = response.data;
      }else {
        this.utilityApi.displayError('Unable to fetch departments');
      }
      this.splashScreen.hide();
    },()=>{
      this.splashScreen.hide();
      this.utilityApi.displayError('Unable to fetch departments');
    });
    // end of getting all department in the system



  }

  editUser() : void 
  {
    if (this.EditUserForm.valid) 
    {
      const userData = {
          id           : this.user.id,
          fullName     : this.EditUserForm.value.FullName,
          emailAddress : "",//this.EditUserForm.value.Email,
          branch       : this.EditUserForm.value.Branch,
          role       : this.EditUserForm.value.UserRole,
          username     : this.EditUserForm.value.Username,
          modifiedBy   : this.loggedInUsername,
          department   : this.EditUserForm.value.Department
      };
      console.log(userData);
      // return;
      this.splashScreen.show();
        this.utilityApi.updateUser(userData).subscribe(response => {
          this.splashScreen.hide();
          if (response.code === 200) {
            this.utilityApi.displaySuccessRedirect('User '+this.EditUserForm.value.FullName+ ' was successfully modified.', '/xmobileadmin/user-management/users');
          }else {
            this.utilityApi.displayFailed(response.errMsg);
          }
        },() => {
            this.splashScreen.hide();
            this.utilityApi.displayFailed('Network/Server Error!');
          });
    }
  }

}
