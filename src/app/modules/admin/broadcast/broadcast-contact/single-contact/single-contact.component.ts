import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilityService } from 'app/shared/services/utility.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-single-contact',
  templateUrl: './single-contact.component.html',
  styleUrls: ['./single-contact.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class SingleContactComponent implements OnInit {

  CreateUserForm: FormGroup;
  role:string;
  branches:any[];
  username: string;
  //dialogRef: MatDialogRef<ConfirmUserDetailsComponent>;
  filteredBranches: any[] = [];
  accountType:[];
  
  constructor(
    private utilityApi: UtilityService, 
    private _formBuilder: FormBuilder,
    private splashScreen: FuseSplashScreenService,
    private authService: AuthService,
    private _matDialog: MatDialog,
    private confirmationDialog: FuseConfirmationService,
  ) { 
    this.CreateUserForm = this._formBuilder.group({
        FullName   : ['',Validators.required],
        Email      : ['',[Validators.required,Validators.email]],
        Mobile     : ['',Validators.required],
        Gender     : ['',Validators.required],
        Religion   : ['',Validators.required],
        SMSAlert   : false,
        EmailAlert : false,
        AccountType: ['',Validators.required]
    });
    this.role = this.authService.getLoggedInUserDetails().roleId;
    this.username = this.authService.getLoggedInUserDetails().username;
  }

  ngOnInit(): void 
  {
  
    // this.splashScreen.show();
    // this.utilityApi.getBranches().subscribe(response => {
    //   if (response.errCode === 0) {
    //     this.branches = response.data.branches;
    //     //this.branches.forEach((branch)=>this.filteredBranches.push(branch));
    //     //this.CreateUserForm.get('Branch').valueChanges.subscribe((value)=>this._filter(value));
    //   }else {
    //     this.utilityApi.displayError('Unable to fetch branches');
    //   }
    //   this.splashScreen.hide();
    // },()=>{
    //   this.splashScreen.hide();
    //   this.utilityApi.displayError('Unable to fetch branches');
    // });

    this.splashScreen.show();
    this.utilityApi.getAccountClass().subscribe(response => {
      console.log(response);
      if (response.code === 200) {
        this.accountType = response.data;
      }else {
        this.utilityApi.displayError('Unable to fetch account classes');
      }
      this.splashScreen.hide();
    },()=>{
      this.splashScreen.hide();
      this.utilityApi.displayError('Unable to fetch account classes');
    });


  }

  /* private _filter(value: string): void {
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
  } */

  /* displayWithFilter (branch : any) :string
  {
    return branch ? `${branch.branchName}` : '';
  }

  sortBy(prop: string) {
    return this.filteredBranches.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  } */

  createUser(): void 
  {
    if (this.CreateUserForm.valid) {
      const userData = {
        fname        : this.CreateUserForm.value.Firstname,
        emailAddress : this.CreateUserForm.value.Email,
        branch       : this.CreateUserForm.value.Branch.branchCode,
        lname        : this.CreateUserForm.value.Lastname,
        phoneNumber  : this.CreateUserForm.value.Mobile,
        roleId       : this.CreateUserForm.value.UserRole,
        username     : this.CreateUserForm.value.Username,
        createdBy    : this.username
    };
    /* this.dialogRef = this._matDialog.open(ConfirmUserDetailsComponent,{
        data: {
          userDetails : this.CreateUserForm.value
        },
        width : '500px',
        disableClose: false
    }); */

    /* this.dialogRef.afterClosed().subscribe((result)=>{
      
      if(result === true) {
        this.splashScreen.show();
        this.utilityApi.createAdbUser(JSON.stringify(userData)).subscribe(response => {
          this.splashScreen.hide();
          if (response.errCode === 0) {
            this.utilityApi.displaySuccessRedirect('User '+this.CreateUserForm.value.Firstname+ ' was successfully created.', '/xmobileadmin/user-management/users');
          }else {
            this.utilityApi.displayFailed(response.errMsg);
          }
        },() => {
            this.splashScreen.hide();
            this.utilityApi.displayFailed('Network / Server Error!');
          });
        }
      }); */
    
    }
  }

  authorizeBroadContact() : void 
  {
    if(this.CreateUserForm.valid==true)
    {
      const dialogRef = this.confirmationDialog.open({
        "title": "Upload broadcast Contact",
        "message": `Are you sure you want to upload broadcast contact`,
        "icon": {
          "show": true,
          "name": "mat_outline:library_add_check",
          "color": "info"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "Submit",
            "color": "accent"
          },
          "cancel": {
            "show": true,
            "label": "Cancel"
          }
        },
        "dismissible": true
      });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
              this.splashScreen.show();
              const contacct = {
                fullName: this.CreateUserForm.value.FullName,
                emailAddress: this.CreateUserForm.value.Email,
                phoneNumber: this.CreateUserForm.value.Mobile,
                broadcastSms: this.CreateUserForm.value.SMSAlert,
                broadcastEmail: this.CreateUserForm.value.EmailAlert,
                guid: "",
                customerExist: "",
                gender: this.CreateUserForm.value.Gender,
                religion: this.CreateUserForm.value.Religion,
                accountType: this.CreateUserForm.value.AccountType
                
              };
              this.utilityApi.registerBroadcastContact(JSON.stringify(contacct)).subscribe(response =>{
                this.splashScreen.hide();
                if (response.code === 200) {
                  this.utilityApi.displaySuccess('Contact uploaded successfully');
                }else {
                  this.utilityApi.displayFailed('Contact uploaded failed try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('Contact uploaded process failed, server error.');
              });
            }
        });
    }
   }


}
