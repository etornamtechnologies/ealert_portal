import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilityService } from 'app/shared/services/utility.service';
import _ from 'lodash';

@Component({
  selector: 'app-broadcast-sms',
  templateUrl: './broadcast-sms.component.html',
  styleUrls: ['./broadcast-sms.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class BroadcastSmsComponent implements OnInit {

  SMSBroadcastForm: FormGroup;
  FileUploadForm :FormGroup;
  role:string;
  branches:any[];
  username: string;
  broadcastNow :boolean = false;
  specificList :boolean = false;
  accountType:[];
  //dialogRef: MatDialogRef<ConfirmUserDetailsComponent>;
  filteredBranches: any[] = [];
  customerListFileData: any;
  
  constructor(
    private utilityApi: UtilityService, 
    private _formBuilder: FormBuilder,
    private splashScreen: FuseSplashScreenService,
    private authService: AuthService,
    private _matDialog: MatDialog
  ) { 
    this.SMSBroadcastForm = this._formBuilder.group({
        Message      : ['',Validators.required],
        RunDate      : ['',Validators.required],
        RunTime      : ['',Validators.required],
        AccountType  : ['',Validators.required],
        Religion     : ['',Validators.required],
        Gender       : ['',Validators.required],
        BroadcastNow  : false,
        Broadcastlist : false,
    });
    this. FileUploadForm = this._formBuilder.group({
      myfile        : ['']

    })
    this.role = this.authService.getLoggedInUserDetails().roleId;
    this.username = this.authService.getLoggedInUserDetails().username;
  }

  ngOnInit(): void 
  {
  
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

  onFileSelect(event) {
    let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      if (!_.includes(af, file.type)) {
        this.utilityApi.displayFailed('Only EXCEL Docs Allowed!','File not allowed');
      } else {
        this.customerListFileData = file;
        //this.fileUploadForm.get('myfile').setValue(file);
        console.log(this.customerListFileData);
      }
    }
  }

  SubmitExcelTemp() {
    let aff = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (!this.customerListFileData) {
      this.utilityApi.displayError('Please select an excel file');
      return false;
    }
    if (!_.includes(aff, this.customerListFileData.type))
    {
      this.utilityApi.displayError('Only EXCEL Docs Allowed!');
      return false;
    }
    console.log(this.customerListFileData);
    let formData = new FormData();
    formData.set('file', this.customerListFileData);
  }


  
  createSmsBroadcast(): void 
  {
    this.ValidatForm();
    if (this.SMSBroadcastForm.value.Broadcastlist && !this.customerListFileData) {
      this.utilityApi.displayError('Please select an excel file');
      return;
    }
   //if (this.SMSBroadcastForm.valid && this.FileUploadForm.valid) {
    if (this.SMSBroadcastForm.valid) {
      // let formData:any = new FormData();
      // formData.set('contactsFile', this.customerListFileData);
      // formData.append('isContactUpload',this.SMSBroadcastForm.value.Broadcastlist)
      // formData.append('message', this.SMSBroadcastForm.value.message);
      // formData.append('runDate', this.utilityApi.transformDate(this.SMSBroadcastForm.value.RunDate,'dd/MM/yyyy'));
      // formData.append('runTime', this.utilityApi.transformTime(this.SMSBroadcastForm.value.RunTime));
      // formData.append('broadcastNow', this.SMSBroadcastForm.value.BroadcastNow);
      // formData.append('accountType', this.SMSBroadcastForm.value.AccountType);
      // formData.append('religion', this.SMSBroadcastForm.value.Religion);
      // formData.append('gender', this.SMSBroadcastForm.value.Gender);

      const broadcastData = {
        message       : this.SMSBroadcastForm.value.Message,
        runDate       : this.utilityApi.transformDate(this.SMSBroadcastForm.value.RunDate,'dd/MM/yyyy'),
        runTime       : this.utilityApi.transformTime(this.SMSBroadcastForm.value.RunTime),//this.SMSBroadcastForm.value.RunTime,
        // runTime       : this.SMSBroadcastForm.value.RunTime,
        broadcastNow  : this.SMSBroadcastForm.value.BroadcastNow,
        accountType   : this.SMSBroadcastForm.value.AccountType,
        religion      : this.SMSBroadcastForm.value.Religion,
        gender        : this.SMSBroadcastForm.value.Gender,
      };

      console.log('payload', broadcastData)

      
      this.splashScreen.show();
      // JSON.stringify(formData)
          this.utilityApi.sendSMSBroadcast(broadcastData).subscribe(response => {
            this.splashScreen.hide();
            if (response.code === 200) {
              this.utilityApi.displaySuccessRedirect('Broadcast was successfully sent for authorization.', '/ealert/dashboard');
            }else {
              this.utilityApi.displayFailed(response.message);
            }
          },() => {
              this.splashScreen.hide();
              this.utilityApi.displayFailed('Network / Server Error!');
            });
    }
  }


ValidatForm():void
{
  if(!this.SMSBroadcastForm.value.BroadcastNow)
    {
      console.log(this.SMSBroadcastForm.value.BroadcastNow);
      this.SMSBroadcastForm.get('RunDate').setValidators(Validators.required);
      this.SMSBroadcastForm.get('RunTime').setValidators(Validators.required);
      this.SMSBroadcastForm.get('RunDate').updateValueAndValidity();
      this.SMSBroadcastForm.get('RunTime').updateValueAndValidity();
     }
    else{
      console.log("checked")
      this.SMSBroadcastForm.get('RunDate').clearValidators();
      this.SMSBroadcastForm.get('RunTime').clearValidators();      
      this.SMSBroadcastForm.get('RunDate').updateValueAndValidity();
      this.SMSBroadcastForm.get('RunTime').updateValueAndValidity();

    }

    if (!this.SMSBroadcastForm.value.Broadcastlist)
    {
      console.log(this.SMSBroadcastForm.value.Broadcastlist);
      this.SMSBroadcastForm.get('AccountType').setValidators(Validators.required);
      this.SMSBroadcastForm.get('Religion').setValidators(Validators.required);
      this.SMSBroadcastForm.get('Gender').setValidators(Validators.required);
      // this.FileUploadForm.get('myfile').clearValidators();
    
      this.SMSBroadcastForm.get('AccountType').updateValueAndValidity();
      this.SMSBroadcastForm.get('Religion').updateValueAndValidity();
      this.SMSBroadcastForm.get('Gender').updateValueAndValidity();
      // this.FileUploadForm.get('myfile').updateValueAndValidity();
     }
    else{

      console.log("checked" + this.customerListFileData )
      this.SMSBroadcastForm.get('AccountType').clearValidators();
      this.SMSBroadcastForm.get('Religion').clearValidators();   
      this.SMSBroadcastForm.get('Gender').clearValidators();
      // this.FileUploadForm.get('myfile').setValidators(Validators.required);
    
      this.SMSBroadcastForm.get('AccountType').updateValueAndValidity();
      this.SMSBroadcastForm.get('Religion').updateValueAndValidity();
      this.SMSBroadcastForm.get('Gender').updateValueAndValidity();
      // this.FileUploadForm.get('myfile').updateValueAndValidity();
    
    }



}
  




  createSmsBroadcast_2023_01_30(): void 
  {
    if (this.SMSBroadcastForm.valid && this.FileUploadForm.valid) {
      const broadcastData = {
        message       : this.SMSBroadcastForm.value.Message,
        runDate       : this.utilityApi.transformDate(this.SMSBroadcastForm.value.RunDate,'dd/MM/yyyy'),
        runTime       : this.utilityApi.transformTime(this.SMSBroadcastForm.value.RunTime),//this.SMSBroadcastForm.value.RunTime,
        // runTime       : this.SMSBroadcastForm.value.RunTime,
        broadcastNow  : this.SMSBroadcastForm.value.BroadcastNow,
        accountType   : this.SMSBroadcastForm.value.AccountType,
        religion      : this.SMSBroadcastForm.value.Religion,
        gender        : this.SMSBroadcastForm.value.Gender,
    };

    console.log(broadcastData);
    this.splashScreen.show();
        this.utilityApi.sendSMSBroadcast(JSON.stringify(broadcastData)).subscribe(response => {
          this.splashScreen.hide();
          if (response.code === 200) {
            this.utilityApi.displaySuccessRedirect('Broad was successfully sent for authorization.', '/ealert/dashboard');
          }else {
            this.utilityApi.displayFailed(response.message);
          }
        },() => {
            this.splashScreen.hide();
            this.utilityApi.displayFailed('Network / Server Error!');
          });
    /* this.dialogRef = this._matDialog.open(ConfirmUserDetailsComponent,{
        data: {
          userDetails : this.SMSBroadcastForm.value
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
            this.utilityApi.displaySuccessRedirect('User '+this.SMSBroadcastForm.value.Firstname+ ' was successfully created.', '/xmobileadmin/user-management/users');
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

}
