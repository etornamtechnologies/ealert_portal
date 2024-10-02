import { ConditionalExpr, ThrowStmt } from '@angular/compiler';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilityService } from 'app/shared/services/utility.service';
import moment from 'moment';
import { ConfirmCustomerDetailsComponent } from './confirm-customer-details/confirm-customer-details.component';
import { VerifyCustomerComponent } from './verify-customer/verify-customer.component';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AddCustomerComponent implements OnInit {

  CreateCustomerForm: FormGroup;
  branch:string;
  loggedInUsername:string;
  selectedCountry:string = 'GH|Ghana';
  customerAccounts: any[] = [];
  dialogRef: MatDialogRef<VerifyCustomerComponent>;
  dialogRef2: MatDialogRef<ConfirmCustomerDetailsComponent>;
  isAccountVerified:boolean = false;
  customerInfo:any;
  wantLimit:boolean = true;
  autoSyncVar:boolean = true;
    
  constructor(
    private utilityApi: UtilityService, 
    private _formBuilder: FormBuilder,
    private splashScreen: FuseSplashScreenService,
    private _matDialog: MatDialog,
    private authService: AuthService
  ) {
      this.CreateCustomerForm = this._formBuilder.group({
        SMSAlert         : false,
        EmailAlert       : false,
        DailyStatements  : false,
        WeeklyStatements : false,
        MonthlyStatements: false,
        AnnualStatements : false,
        PF128Statements  : false,
        PF120Statements  : false,
        BirthdaySMSAlert : false,
        BirthdayEmailAlert:false,
        autoSync         : false,
        Phone            :[''], //['',Validators.required],
        ActiveMobile     : [''],
        Email            : [''],//[Validators.required]
        DateOfBirth      : '',//['',Validators.required],
        AccountNo        : ['',Validators.required],
        CreditLimit      : [0],
        DebitLimit       : [0],
        BicCode          : [''],
        Gender           : ['',Validators.required],
        Religion         : ['',Validators.required],
        
        
    });
    this.loggedInUsername = this.authService.getLoggedInUserDetails().username;
    this.branch = this.authService.getLoggedInUserDetails().branch;
   }

  ngOnInit(): void 
  {

  }

  createCustomer(): void 
  {
    console.log(this.customerInfo);
    if (this.CreateCustomerForm.valid) {
      const finalCustomerDetails = {
        accountNumber         : this.customerInfo.accountNumber,
        activeMobile          :  this.customerInfo.accountNumber,//this.CreateCustomerForm.value.ActiveMobile,
        bicCode               : this.CreateCustomerForm.value.ActiveMobile,
        branch                : this.customerInfo.branch,
        creditLimit           : this.CreateCustomerForm.value.CreditLimit,
        customerId            : this.customerInfo.customerId,
        customerName          : this.customerInfo.customerName,
        dateOfBirth           : this.CreateCustomerForm.value.DateOfBirth,
        // this.CreateCustomerForm.value.DateOfBirth,
        debitLimit            : this.CreateCustomerForm.value.DebitLimit,
        email                 : this.CreateCustomerForm.value.Email,
        gender                : this.CreateCustomerForm.value.Gender,
        phoneNumber           : this.CreateCustomerForm.value.Phone,
        religion              : this.CreateCustomerForm.value.Religion,
        wantAnnualStatement   : this.CreateCustomerForm.value.AnnualStatements,
        wantBirthdayEmailAlert: this.CreateCustomerForm.value.BirthdayEmailAlert,
        wantBirthdaySMSAlert  : this.CreateCustomerForm.value.BirthdaySMSAlert,
        wantDailyStatement    : this.CreateCustomerForm.value.DailyStatements,
        wantEmailAlert        : this.CreateCustomerForm.value.EmailAlert,
        wantMT940             : this.customerInfo.wantMT940,
        wantMonthlyStatement  : this.CreateCustomerForm.value.MonthlyStatements,
        wantPF120Statements   : this.customerInfo.wantPF120Statements,
        autoSync              : this.CreateCustomerForm.value.autoSync,
        wantPF128Statements   : this.customerInfo.wantPF128Statements,
        wantSmsAlert          : this.CreateCustomerForm.value.SMSAlert,
        wantWeeklyStatement   : this.CreateCustomerForm.value.WeeklyStatements,
      };
      console.log(finalCustomerDetails);
      
      this.dialogRef2 = this._matDialog.open(ConfirmCustomerDetailsComponent,{
          data: {
            customerDetails : finalCustomerDetails
          },
          minWidth : '720px',
          width : '720px',
          disableClose: false
      });

      this.dialogRef2.afterClosed().subscribe((result)=>{
        if(result === true) {
          this.splashScreen.show();
          // console.log(finalCustomerDetails);
          this.utilityApi.createCustomer(JSON.stringify(finalCustomerDetails)).subscribe(response =>{
            this.splashScreen.hide();
            console.log(response);
            if(response.code === 200) {
              console.log('entered well well')
              this.utilityApi.displaySuccessRedirect('Customer was successfully registered!','/ealert/customer-management/customers')
            }else {
              console.log('didnt entered well well')
              this.utilityApi.displayFailed(response.message);
            }
          },()=>{
            this.splashScreen.hide();
            this.utilityApi.displayFailed('Server / Network Error');
          });
        }
      });
    }
  }

  verifyAccount() : void 
  {
    if (this.CreateCustomerForm.value.AccountNo !== '') {
      this.splashScreen.show();
      const accountParam = {
        accOrName : this.CreateCustomerForm.value.AccountNo,
        searchMode: 'AccountRegistration'
      };
      this.utilityApi.verifyCustomerAccount(JSON.stringify(accountParam)).subscribe(response =>{
        this.splashScreen.hide();
        if (response.code === 200) {
          this.customerAccounts = response.data;
          this.dialogRef = this._matDialog.open(VerifyCustomerComponent,{
            data: {
              accounts : this.customerAccounts
             },
            minWidth : '750',
            disableClose: false
          });

          this.dialogRef.afterClosed().subscribe((result)=>{
            if(result !== null) {
              this.customerInfo = result;
              console.log(result);
              this.CreateCustomerForm.patchValue({
                SMSAlert : this.customerInfo.wantSmsAlert,
                EmailAlert : this.customerInfo.wantEmailAlert,
                DailyStatements : this.customerInfo.wantDailyStatement,
                WeeklyStatements : this.customerInfo.wantWeeklyStatement,
                MonthlyStatements : this.customerInfo.wantMonthlyStatement,
                AnnualStatements : this.customerInfo.wantAnnualStatement,
                BirthdaySMSAlert : this.customerInfo.wantBirthdaySMSAlert,
                BirthdayEmailAlert : this.customerInfo.wantBirthdayEmailAlert,
                Phone : this.customerInfo.phoneNumber,
                Gender : this.customerInfo.gender,
                Email : this.customerInfo.email,
                BicCode : this.customerInfo.bicCode,
                DateOfBirth: this.customerInfo.dateOfBirth,// this.utilityApi.transformDate(this.customerInfo.dateOfBirth,'dd/MM/yyyy'),
                // ActiveMobile : this.customerInfo.activeMobile
              });
              this.isAccountVerified = true;
              // this.CreateCustomerForm.get('Gender').disabled;

            }
          });
        }else {
          this.utilityApi.displayFailed(response.message,'Account verification failed');
        }
      },()=> {
        this.splashScreen.hide();
        this.utilityApi.displayFailed('Customer account verification failed');
      });
    }
    
  }


  // clean_date(date_val){
  //   console.log(date_val); 
  //   let serializedDate;
  //   if ((date_val.toString()).includes("/"))
  //   {
  //     console.log(date_val);
  //     date_val = date_val.toString().split('/');
  //     date_val = date_val[1]+"/"+date_val[0]+"/"+date_val[2]
  //     console.log(date_val);
  //     serializedDate = new Date(date_val);
  //     console.log(serializedDate);
  //   }
  //   else
  //   {
  //     let date_day = ((date_val).day()).toString();
  //     let date_month = (date_val.month() + 1).toString();
  //     let date_year = (date_val.year()).toString();
  //     if (date_month.length < 2) 
  //       date_month = '0' + date_month;
  //     if (date_day.length < 2) 
  //       date_day = '0' + date_day;
  //     serializedDate = date_day + "/" + date_month + "/" + date_year;
  //   }
  //   console.log(serializedDate);
  //   return serializedDate;
    
  // }
}
