import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilityService } from 'app/shared/services/utility.service';
import { ConfirmUserDetailsComponent } from './confirm-user-details/confirm-user-details.component';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations,
  // selector: 'progress-spinner-overview-example',
  // templateUrl: 'progress-spinner-overview-example.html',
})
export class AddUserComponent implements OnInit {

  CreateUserForm: FormGroup;
  role:string;
  branches:any[];
  roles:any[];
  departments:any[];
  username: string;
  dialogRef: MatDialogRef<ConfirmUserDetailsComponent>;
  filteredBranches: any[] = [];
  validUser :boolean = true;
  inValidUser:boolean = false;
  
  constructor(
    private utilityApi: UtilityService, 
    private _formBuilder: FormBuilder,
    private splashScreen: FuseSplashScreenService,
    // private inputloader: ,
    
    private authService: AuthService,
    private _matDialog: MatDialog,
    private renderer: Renderer2
  ) { 
    
    this.CreateUserForm = this._formBuilder.group({
        Firstname  : [''],
        Lastname   : ['',Validators.required],
        // Email      : ['',[Validators.required,Validators.email]],
        UserRole   : ['',Validators.required],
        Username   : ['',Validators.required],
        Branch     : ['',Validators.required],
        Department : ['', Validators.required]
    });
    this.role = this.authService.getLoggedInUserDetails().roleId;
    this.username = this.authService.getLoggedInUserDetails().username;
  }

  ngOnInit(): void 
  {
    // get all branches in the system
    this.splashScreen.show();
    this.utilityApi.getBranches().subscribe(response => {
      console.log(response);
      if (response.code === 200) {
        this.branches = response.data;
        this.branches.forEach((branch)=>this.filteredBranches.push(branch));
        this.CreateUserForm.get('Branch').valueChanges.subscribe((value)=>this._filter(value));
      }else {
        this.utilityApi.displayError('Unable to fetch branches');
      }
      this.splashScreen.hide();
    },()=>{
      this.splashScreen.hide();
      this.utilityApi.displayError('Unable to fetch branches');
    });
    // end of getting branches 

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

  private _filter(value: string): void {
    this.filteredBranches = [];
    const filterValue = value.toString().toLowerCase();
    if(value !== '') {
      this.branches.forEach((branch)=> {
        if (branch.branchName.toLowerCase().includes(filterValue)) 
        {
          this.filteredBranches.push(branch);
        }
      });
    }else {
      this.branches.forEach((branch)=>this.filteredBranches.push(branch));
    }
  }

  displayWithFilter (branch : any) :string
  {
    return branch ? `${branch.branchName}` : '';
  }

  sortBy(prop: string) {
    return this.filteredBranches.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  }

  createUser(): void 
  {
    console.log(this.CreateUserForm.value.UserRole.roleName);
    console.log(this.CreateUserForm.value);
    if (this.CreateUserForm.valid) {
      const userData = {
        fullName     : (this.CreateUserForm.value.Firstname+" "+this.CreateUserForm.value.Lastname),
        // emailAddress : this.CreateUserForm.value.Email,
        branch       : this.CreateUserForm.value.Branch.branchCode,
        role         : this.CreateUserForm.value.UserRole.id,
        userName     : this.CreateUserForm.value.Username,
        createdBy    : this.username,
        department   : this.CreateUserForm.value.Department.id,
        isActive: true
        // lname        : this.CreateUserForm.value.Lastname,
        // phoneNumber  : this.CreateUserForm.value.Mobile,
    };
    this.dialogRef = this._matDialog.open(ConfirmUserDetailsComponent,{
        data: {
          userDetails : this.CreateUserForm.value
        },
        width : '500px',
        disableClose: false
    });

    this.dialogRef.afterClosed().subscribe((result)=>{
      
      if(result === true) {
        this.splashScreen.show();
        this.utilityApi.createAppUser(JSON.stringify(userData)).subscribe(response => {
          this.splashScreen.hide();
          if (response.code === 200) {
            this.utilityApi.displaySuccessRedirect('User '+this.CreateUserForm.value.Firstname+ ' was successfully created.', '/ealert/user-management/users');
          }else {
            this.utilityApi.displayFailed(response.message);
          }
        },() => {
            this.splashScreen.hide();
            this.utilityApi.displayFailed('Network / Server Error!');
          });
        }
      });
    
    }
  }


  userValdate(adUser:any):void {
    if(adUser.length > 0) {
      console.log(adUser);
      this.splashScreen.show();
      let data ={
        username : adUser
      };
      // document.querySelector("mat-progress-bar").removeAttribute("class");
      // this.utilityApi.adValidation(JSON.stringify(data)).subscribe(response => {
      this.utilityApi.adValidation(adUser).subscribe(response => {
        this.splashScreen.hide();
        if (response.code === 200) {
          this.validUser=true;
          this.inValidUser=false;
          this.CreateUserForm.get('Firstname').setValue(response.data.firstName);
          this.CreateUserForm.get('Lastname').setValue(response.data.lastName);
        }else {
          this.validUser=false;
          this.inValidUser=true;
          this.utilityApi.displayError('Invaid username(AD username)');
          // progressloader
        }
      },() => {
        this.validUser=false; 
        this.inValidUser=true; 
        this.splashScreen.hide();
        this.utilityApi.displayError('Error while validating username');
        
        });
      }
    
    // this.validUser=true;
  }

}
