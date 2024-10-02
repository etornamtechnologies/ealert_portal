import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { AppStore } from 'app/shared/localstorage-helper';
import { UtilityService } from 'app/shared/services/utility.service';
import { VerifyCustomerComponent } from '../add-customer/verify-customer/verify-customer.component';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations

})
export class EditCustomerComponent implements OnInit {

  EditCustomerForm: FormGroup;
  branch:string;
  loggedInUsername:string;
  customer:any;
  customerAccounts: any[] = [];
  custdata:any;
  CreateCustomerForm:any;
  customerInfo:any;
  dialogRef: MatDialogRef<VerifyCustomerComponent>;
  wantLimit:boolean = true;
  constructor(
    private utilityApi: UtilityService, 
    private _formBuilder: FormBuilder,
    private splashScreen: FuseSplashScreenService,
    private _matDialog: MatDialog,
    private authService: AuthService
  ) { 
    this.custdata = JSON.parse(AppStore.get('editCustomerData'));
    this.EditCustomerForm = this._formBuilder.group({
      // SMSAlert         : this.custdata.smsAlert==1? true : false,
      // EmailAlert       : this.custdata.emailAlert==1? true : false,
      // DailyStatements  : this.custdata.dailyStmnt==1? true : false,
      // WeeklyStatements : this.custdata.weeklyStmnt==1? true : false,
      // MonthlyStatements: this.custdata.monthlyStmnt==1? true : false,
      // AnnualStatements : this.custdata.annualStmnt==1? true : false,
      // PF128Statements  : this.custdata.wantPF128Statements,
      // PF120Statements  : this.custdata.wantPF120Statements,
      BirthdaySMSAlert : this.custdata.wantBirthdaySMSAlert==1? true : false,
      BirthdayEmailAlert:this.custdata.wantBirthdayEmailAlert==1? true : false,
      DateOfBirth      : [this.custdata.dateOfBirth],
      Phone            : [this.custdata.phoneNumber,Validators.required],
      // ActiveMobile     : [this.custdata.activeMobile],
      Email            : [this.custdata.email,[Validators.required]],
      // AccountNo        : [this.custdata.accNo,Validators.required],
      // CreditLimit      : [this.custdata.creditLimit],
      // DebitLimit       : [this.custdata.debitLimit],
      BicCode          : [this.custdata.bicCode],
      Gender           : [this.custdata.gender,Validators.required],
      Religion         : [this.custdata.religion,Validators.required],
      
    });
    
    console.log(this.custdata);
    this.CreateCustomerForm = this.custdata;
    this.customerInfo =  this.custdata;

    this.loggedInUsername = this.authService.getLoggedInUserDetails().username;
    this.branch = this.authService.getLoggedInUserDetails().branch;
    }

  ngOnInit(): void 
  {

  }

  


  editCustomer(): void 
  {
    if (this.EditCustomerForm.valid) {
      const finalCustomerDetails = {
        customerName          : this.customerInfo.customerName,
        customerId            :  this.customerInfo.customerId,
        wantBirthdaySMSAlert  : this.EditCustomerForm.value.BirthdaySMSAlert,
        wantBirthdayEmailAlert: this.EditCustomerForm.value.BirthdayEmailAlert,
        email                 : this.EditCustomerForm.value.Email,
        phoneNumber           : this.EditCustomerForm.value.Phone,
        dateOfBirth           : this.EditCustomerForm.value.DateOfBirth,
        gender                : this.EditCustomerForm.value.Gender,
        religion              : this.EditCustomerForm.value.Religion,
        acctNum               : this.customerInfo.acctNum==''? '':this.customerInfo.acctNum

      };
      console.log(finalCustomerDetails);
      this.splashScreen.show();
      this.utilityApi.omniupdateCustomer(JSON.stringify(finalCustomerDetails)).subscribe(response =>{
        this.splashScreen.hide();
        console.log(response);
        if(response.code === 200) {
          this.utilityApi.displaySuccessRedirect('Customer was successfully edited!','/ealert/customer-management/customers')
        }else {
          this.utilityApi.displayFailed(response.message);
        }
      },()=>{
        this.splashScreen.hide();
        this.utilityApi.displayFailed('Server / Network Error');
      });

      
    }
    else{
      this.utilityApi.displayFailed('Error in data input');
    }
  }




  verifyAccount() : void 
  {
    if (this.EditCustomerForm.value.AccountNo !== '') {
      this.splashScreen.show();
      this.utilityApi.verifyCustomerAccount(this.EditCustomerForm.value.AccountNo).subscribe(response =>{
        this.splashScreen.hide();
        if (response.errCode === 0) {
          this.customerAccounts = response.data.accounts;
          this.dialogRef = this._matDialog.open(VerifyCustomerComponent,{
            data: {
              accounts : this.customerAccounts
             },
            width : '500px',
            disableClose: false
        });
        }else {
          this.utilityApi.displayFailed('Customer account verification failed');
        }
      },()=> {
        this.splashScreen.hide();
        this.utilityApi.displayFailed('Customer account verification failed');
      });
    }
    
  }

  // fetach_cus_data(): void
  fetach_cus_data(cust_details)  
  {
    console.log(cust_details);
    if (cust_details !== '') {
      this.splashScreen.show();
      const accountParam = {
        accOrName : cust_details.acDesc,
        searchMode: 'AccountRegistration'
      };
      console.log(cust_details);
      this.utilityApi.verifyCustomerAccount(JSON.stringify(accountParam)).subscribe(response =>{
        console.log(response.code);
        this.splashScreen.hide();
        if(response.code === 200) {
          // this.custdata = response.data;
          console.log(response.data[0]);
          return response.data[0];

        }
        else {
          this.utilityApi.displayFailed(response.errMsg,'Cutomer details featch failed');
          return ''
           
        }
      },()=> {
        this.splashScreen.hide();
        this.utilityApi.displayFailed('Customer account details failed');
        return ''
      });
    }
    
  }




}



