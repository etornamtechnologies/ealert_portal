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
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class EditAccountComponent implements OnInit {

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
  autoSyncVar:boolean = false;
  constructor(
    private utilityApi: UtilityService, 
    private _formBuilder: FormBuilder,
    private splashScreen: FuseSplashScreenService,
    private _matDialog: MatDialog,
    private authService: AuthService
  ) { 
    this.custdata = JSON.parse(AppStore.get('editCustomerData'));
    this.EditCustomerForm = this._formBuilder.group({
      SMSAlert         : this.custdata.wantSmsAlert,
      EmailAlert       : this.custdata.wantEmailAlert,
      DailyStatements  : this.custdata.wantDailyStatement,
      WeeklyStatements : this.custdata.wantWeeklyStatement,
      MonthlyStatements: this.custdata.wantMonthlyStatement,
      AnnualStatements : this.custdata.wantAnnualStatement,
      PF128Statements  : this.custdata.wantPF128Statements,
      PF120Statements  : this.custdata.wantPF120Statements,
      BirthdaySMSAlert : this.custdata.wantBirthdaySMSAlert,
      BirthdayEmailAlert:this.custdata.wantBirthdayEmailAlert,
      Phone            : [this.custdata.phoneNumber,Validators.required],
      ActiveMobile     : this.custdata.activeMobile,
      Email            : [this.custdata.email],//[Validators.required]
      AccountNo        : [this.custdata.accountNumber,Validators.required],
      CreditLimit      : [this.custdata.creditLimit],
      DebitLimit       : [this.custdata.debitLimit],
      BicCode          : [this.custdata.bicCode],
      customerId       :[this.custdata.customerId],
      autoSync         : this.custdata.autoSync,
      // Gender           : [this.custdata.gender,Validators.required],
      // Religion         : [this.custdata.religion,Validators.required],
      // DateOfBirth      : [this.custdata.dateOfBirth,Validators.required],
      
    });
    this.autoSyncVar =   this.custdata.autoSync,
    console.log(this.custdata);
    this.CreateCustomerForm = this.custdata;
    this.customerInfo =  this.custdata;

    this.loggedInUsername = this.authService.getLoggedInUserDetails().username;
    this.branch = this.authService.getLoggedInUserDetails().branch;
    }

  ngOnInit(): void 
  {

  }

  


  editAccount1(): void 
  {
    if (this.EditCustomerForm.valid) {
      const finalCustomerDetails = {
        accountNumber         : this.customerInfo.accountNumber,
        activeMobile          : this.customerInfo.ActiveMobile,
        bicCode               : this.EditCustomerForm.value.bicCode,
        branch                : this.customerInfo.branch,
        creditLimit           : this.EditCustomerForm.value.CreditLimit,
        customerId            : this.customerInfo.customerId,
        customerName          : this.customerInfo.customerName,
        dateOfBirth           : this.EditCustomerForm.value.DateOfBirth,
        debitLimit            : this.EditCustomerForm.value.DebitLimit,
        email                 : this.EditCustomerForm.value.Email,
        gender                : this.EditCustomerForm.value.Gender,
        phoneNumber           : this.EditCustomerForm.value.Phone,
        religion              : this.EditCustomerForm.value.Religion,
        wantAnnualStatement   : this.EditCustomerForm.value.AnnualStatements,
        wantBirthdayEmailAlert: this.EditCustomerForm.value.BirthdayEmailAlert,
        wantBirthdaySMSAlert  : this.EditCustomerForm.value.BirthdaySMSAlert,
        wantDailyStatement    : this.EditCustomerForm.value.DailyStatements,
        wantEmailAlert        : this.EditCustomerForm.value.EmailAlert,
        wantMT940             : this.customerInfo.wantMT940,
        wantMonthlyStatement  : this.EditCustomerForm.value.MonthlyStatements,
        wantPF120Statements   : this.customerInfo.wantPF120Statements,
        wantPF128Statements   : this.customerInfo.wantPF128Statements,
        wantSmsAlert          : this.EditCustomerForm.value.SMSAlert,
        wantWeeklyStatement   : this.EditCustomerForm.value.WeeklyStatements,
      };
      console.log(finalCustomerDetails);
      this.splashScreen.show();
      this.utilityApi.createCustomer(JSON.stringify(finalCustomerDetails)).subscribe(response =>{
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

  editAccount(): void 
  {
    if (this.EditCustomerForm.valid) {
      const finalCustomerDetails = {
        accountNumber       : this.customerInfo.accountNumber,
        customerName        : this.customerInfo.customerName,
        customerId          : this.customerInfo.customerId,
        branch              : "",   
        wantSmsAlert        : this.EditCustomerForm.value.SMSAlert,
        wantEmailAlert      : this.EditCustomerForm.value.EmailAlert,   
        wantDailyStatement  : this.EditCustomerForm.value.DailyStatements,
        wantWeeklyStatement : this.EditCustomerForm.value.WeeklyStatements,
        wantMonthlyStatement: this.EditCustomerForm.value.MonthlyStatements,
        wantAnnualStatement : this.EditCustomerForm.value.AnnualStatements,  
        wantPF128Statements : "",  
        wantPF120Statements : "",  
        wantBirthdaySMSAlert: this.customerInfo.wantBirthdaySMSAlert,   
        wantBirthdayEmailAlert:this.customerInfo.wantBirthdayEmailAlert,
        wantMT940           :"",   
        bicCode             :"",  
        email               : this.EditCustomerForm.value.Email,    
        phoneNumber         : this.EditCustomerForm.value.Phone,      
        activeMobile        : "",
        dateOfBirth         : "" , 
        creditLimit         : this.EditCustomerForm.value.CreditLimit,
        autoSync              : this.EditCustomerForm.value.autoSync,
        debitLimit          : this.EditCustomerForm.value.DebitLimit,
        gender              :"",  
        religion            : "",  
        dateAuth            : "",  
        dateCreated         : "", 


        // old
        // customerName          : this.customerInfo.customerName,
        // customerId            :  this.customerInfo.customerId,
        // wantBirthdaySMSAlert  : this.EditCustomerForm.value.BirthdaySMSAlert,
        // wantBirthdayEmailAlert: this.EditCustomerForm.value.BirthdayEmailAlert,
        // email                 : this.EditCustomerForm.value.Email,
        // phoneNumber           : this.EditCustomerForm.value.Phone,
        // dateOfBirth           : this.EditCustomerForm.value.DateOfBirth,
        // gender                : this.EditCustomerForm.value.Gender,
        // religion              : this.EditCustomerForm.value.Religion,
        // acctNum               : this.customerInfo.acctNum==''? '':this.customerInfo.acctNum

      };
      console.log(finalCustomerDetails);
      this.splashScreen.show();
      this.utilityApi.omniupdateAccount(JSON.stringify(finalCustomerDetails)).subscribe(response =>{
        this.splashScreen.hide();
        console.log(response);
        if(response.code === 200) {
          this.utilityApi.displaySuccessRedirect('Account was successfully edited!','/ealert/customer-management/customers')
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



