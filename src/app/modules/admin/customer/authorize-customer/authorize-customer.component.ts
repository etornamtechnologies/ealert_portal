import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilityService } from 'app/shared/services/utility.service';
import { ViewCustomerDetailsComponent } from '../view-customer-details/view-customer-details.component';

@Component({
  selector: 'app-authorize-customer',
  templateUrl: './authorize-customer.component.html',
  styleUrls: ['./authorize-customer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AuthorizeCustomerComponent implements OnInit {

  accounts:any[] = [];
  displayedColumns: string[] = ["select_all",'Name','email','account_no','makeId','authtype'];
  // displayedColumns: string[] = ['firstname','lastname','email','account_no','phone','actions'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  customers: any[] = [];
  selectedRecord: any[] = [];
  master: boolean = false;
  userBranch: string;
  username: string;
  AdvanceSearch: FormGroup;
  dialogRef: MatDialogRef<ViewCustomerDetailsComponent>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;
  
  constructor(
    private utilityApi: UtilityService,
    private splashScreen: FuseSplashScreenService,
    private renderer: Renderer2,
    private _formBuilder: FormBuilder,
    private confirmationDialog: FuseConfirmationService,
    private _matDialog: MatDialog,
    private authService: AuthService
  ) { 
    this.userBranch = this.authService.getLoggedInUserDetails().branch;
    this.username = this.authService.getLoggedInUserDetails().username;
    this.AdvanceSearch = this._formBuilder.group({
      SearchOption  : ['',Validators.required],
      SearchValue   : ['']
    });
  }

  ngOnInit(): void 
  {
    this.getUnauthorizedCustomers('D',this.userBranch).then(response => {
      console.log(response);
      if (response.code === 200) {
        console.log('got the data'+ response.data);
        this.customers = response.data;
        this.dataSource = new MatTableDataSource(this.customers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
        this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
        if (this.customers.length === 0) {
          this.isResultEmpty = true;
        }
      }else {
        this.isLoading = false;
        this.utilityApi.displayFailed(response.errMsg);
      }  
    },()=> {
          this.isLoading = false;
          this.utilityApi.displayError('Unable to fetch unauthorized customers');
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
    });
  }

  getUnauthorizedCustomers(status: string, branch: string) : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getCustomersNonAuth(status,branch)
          .subscribe((response: any) => {
            resolve(response);
          },()=> {
            reject();
          });
    });
  }

  applyFilter(filterValue: string): void
  {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getSearchResult(): void 
  {
    if (this.AdvanceSearch.valid) {
      if(this.AdvanceSearch.value.SearchOption !== 'ALL' && this.AdvanceSearch.value.SearchValue === '') {
        this.utilityApi.displayFailed('Please enter your search value','Required field');
        return;
      }
      this.isResultEmpty = false;
      const searchObj = {
        option : this.AdvanceSearch.value.SearchOption,
        value  : this.AdvanceSearch.value.SearchValue,
        branch : this.userBranch,
        status : 'D'
      };
      this.isLoading = true;
      this.renderer.addClass(this.tableDivView.nativeElement,'hidden');
      this.utilityApi.searchCustomerByAuthorization(JSON.stringify(searchObj)).subscribe(response =>{
        if (response.errCode === 0) {
          this.customers = response.data.customers;
          this.dataSource = new MatTableDataSource(this.customers);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
          if (this.customers.length === 0) {
            this.isResultEmpty = true;
          }
        }else {
          this.isLoading = false;
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
          this.utilityApi.displayFailed(response.errMsg);
        }
      },()=> {
        this.isLoading = false;
        this.utilityApi.displayError('Unable to fetch customers');
        this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
      });
    }
  }

  rejectCustomer() : void 
  {
      const dialogRef = this.confirmationDialog.open({
        "title": "Authorize Customer",
        "message": `Are you sure you want to reject the selected customer Account Numbers `,
        "icon": {
          "show": true,
          "name": "mat_outline:library_add_check",
          "color": "info"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "Reject",
            "color": "warn"
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
              const customer = {
                // accountNumber : userDetails.custAcNo,
                // Name     : userDetails.ac_desc,
                // id            : userDetails.id,
                adminUsername : this.username,
                accNos : this.selectedRecord,
                action: "REJECT",
                // lastname      : userDetails.lname,
                // status        : 'A'
            };
            console.log(customer);
            this.utilityApi.authorizeCustomer(JSON.stringify(customer)).subscribe(response =>{
              this.splashScreen.hide();
              if (response.code === 200) {
                this.utilityApi.displaySuccess('Customer Account successfully rejected');
              }else {
                this.utilityApi.displayFailed('Customer Account rejection process failed try again later.');
              }
            },()=>{
              this.splashScreen.hide();
              this.utilityApi.displayFailed('Customer Account rejection process failed, server error.');
            });
            }
        });
   }

   authorizeAccount() : void 
  {
      const dialogRef = this.confirmationDialog.open({
        "title": "Authorize Customer",
        "message": `Are you sure you want to authorise the selected customer Account`,
        "icon": {
          "show": true,
          "name": "mat_outline:library_add_check",
          "color": "info"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "Authorize",
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
              const customer = {
                // accountNumber : userDetails.custAcNo,
                // Name     : userDetails.ac_desc,
                // id            : userDetails.id,
                adminUsername : this.username,
                accNos : this.selectedRecord,
                action: "ACCEPT",
                // lastname      : userDetails.lname,
                // status        : 'A'
            };
            console.log(customer);
            this.utilityApi.authorizeCustomer(JSON.stringify(customer)).subscribe(response =>{
              this.splashScreen.hide();
              if (response.code === 200) {
                this.utilityApi.displaySuccess('Customer Account successfully authorized');
              }else {
                this.utilityApi.displayFailed('Customer Account authorization process failed try again later.');
              }
            },()=>{
              this.splashScreen.hide();
              this.utilityApi.displayFailed('Customer Account authorization process failed, server error.');
            });
            }
        });
   }

   viewCustomerDetails_old(userDetails : any) : void 
   {
    this.splashScreen.show();
    // fetchRegAndEditedCustDetails
    this.utilityApi.fetchRegesteredAccNumber(userDetails.custAcNo).subscribe(response =>{
      this.splashScreen.hide();
      if(response.code === 200) {
        userDetails = response.data
        this.dialogRef = this._matDialog.open(ViewCustomerDetailsComponent,{
          data: {
            userDetails:{
            dailyStmnt:userDetails.dailyStmnt,
            weeklyStmnt:userDetails.weeklyStmnt,
            monthlyStmnt:userDetails.monthlyStmnt,
            wantBirthdaySMSAlert:userDetails.wantBirthdaySMSAlert,
            wantBirthdayEmailAlert:userDetails.wantBirthdayEmailAlert,
            dateOfBirth:userDetails.dateOfBirth,
            email:userDetails.email,
            phone:userDetails.phone,
            activeMobile:userDetails.activeMobile,
            creditLimit:userDetails.creditLimit,
            debitLimit:userDetails.debitLimit,
            bicCode:userDetails.bicCode,
            accNo:userDetails.accNo,
            custId:userDetails.custId,
            smsAlert:userDetails.smsAlert,
            emailAlert:userDetails.emailAlert,
            }
           },
          width : '500px',
          disableClose: false
        });
        

      }
      else {
        this.utilityApi.displayFailed(response.errMsg,'Cutomer details fetch failed');
        // return ''
         
      }
    },()=> {
      this.splashScreen.hide();
      this.utilityApi.displayFailed('Customer account details failed');
      // return ''
    });



    

   }



   
   viewAccountDetails(userDetails : any) : void 
   {
    this.splashScreen.show();
    this.utilityApi.fetchRegAndEditedAcctDetails(userDetails.custAcNo).subscribe(response =>{
      this.splashScreen.hide();
      if(response.code === 200) {
        userDetails = response.data
        this.dialogRef = this._matDialog.open(ViewCustomerDetailsComponent,{
          data: {
            userDetails:{
            dailyStmnt:userDetails.dailyStmnt,
            weeklyStmnt:userDetails.weeklyStmnt,
            monthlyStmnt:userDetails.monthlyStmnt,
            wantBirthdaySMSAlert:userDetails.wantBirthdaySMSAlert,
            wantBirthdayEmailAlert:userDetails.wantBirthdayEmailAlert,
            dateOfBirth:userDetails.dateOfBirth,
            email:userDetails.email,
            phone:userDetails.phone,
            activeMobile:userDetails.activeMobile,
            creditLimit:userDetails.creditLimit,
            debitLimit:userDetails.debitLimit,
            bicCode:userDetails.bicCode,
            accNo:userDetails.accNo,
            custId:userDetails.custId,
            smsAlert:userDetails.smsAlert,
            emailAlert:userDetails.emailAlert,
            autoSync :userDetails.autoSync,
            }
           },
          width : '500px',
          disableClose: false
        });
        

      }
      else {
        this.utilityApi.displayFailed(response.errMsg,'Account details not found');
        // return ''
         
      }
    },()=> {
      this.splashScreen.hide();
      this.utilityApi.displayFailed('Account details failed');
      // return ''
    });



    

   }


   
   
   viewCustomerDetails(userDetails : any) : void 
   {
    this.splashScreen.show();
    this.utilityApi.fetchRegAndEditedCustDetails(userDetails.custNo).subscribe(response =>{
      this.splashScreen.hide();
      if(response.code === 200) {
        userDetails = response.data
        this.dialogRef = this._matDialog.open(ViewCustomerDetailsComponent,{
          data: {
            userDetails:{
            dailyStmnt:userDetails.dailyStmnt,
            weeklyStmnt:userDetails.weeklyStmnt,
            monthlyStmnt:userDetails.monthlyStmnt,
            wantBirthdaySMSAlert:userDetails.wantBirthdaySMSAlert,
            wantBirthdayEmailAlert:userDetails.wantBirthdayEmailAlert,
            dateOfBirth:userDetails.dateOfBirth,
            email:userDetails.email,
            phone:userDetails.phone,
            activeMobile:userDetails.activeMobile,
            creditLimit:userDetails.creditLimit,
            debitLimit:userDetails.debitLimit,
            bicCode:userDetails.bicCode,
            accNo:userDetails.accNo,
            custId:userDetails.custId,
            smsAlert:userDetails.smsAlert,
            emailAlert:userDetails.emailAlert,
            autoSync :userDetails.autoSync,
            }
           },
          width : '500px',
          disableClose: false
        });
        

      }
      else {
        this.utilityApi.displayFailed(response.errMsg,'Cutomer details not found');
        // return ''
         
      }
    },()=> {
      this.splashScreen.hide();
      this.utilityApi.displayFailed('Customer details failed');
      // return ''
    });



    

   }








  customerIsClicked(acountDetails: any): void {
    if (acountDetails.selected) {
        this.selectedRecord.push(acountDetails.custAcNo);
        if (this.selectedRecord.length === this.customers.length) {
            this.master = true;
        }
    } else {
        this.master = false;
        var selectedIndex = this.selectedRecord.indexOf(
          acountDetails.custNo
        );
        this.selectedRecord.splice(selectedIndex, 1);
    }

  } 

  checkUncheckAll(): void {
    this.selectedRecord = [];
    if (this.master) {
        this.master = true;
        this.dataSource.filteredData.forEach((item) => {
            this.selectedRecord.push(item.custAcNo);
        });
    } else {
        this.master = false;
     }
    this.dataSource.filteredData.forEach((child) => {
        child.selected = this.master;
    });
  }



  // rejectCustomer(userDetails : any) : void 
  // {
  //     const dialogRef = this.confirmationDialog.open({
  //       "title": "Authorize Customer",
  //       "message": `Are you sure you want to authorise this customer </br><span class="text-lg font-semibold">${userDetails.ac_desc} ?</span>`,
  //       "icon": {
  //         "show": true,
  //         "name": "mat_outline:library_add_check",
  //         "color": "info"
  //       },
  //       "actions": {
  //         "confirm": {
  //           "show": true,
  //           "label": "Authorize",
  //           "color": "accent"
  //         },
  //         "cancel": {
  //           "show": true,
  //           "label": "Cancel"
  //         }
  //       },
  //       "dismissible": true
  //     });

  //       dialogRef.afterClosed().subscribe((result) => {
  //           if (result === 'confirmed') {
  //             this.splashScreen.show();
  //             const customer = {
  //               accountNumber : userDetails.custNo,
  //               adminUsername : this.username,
  //               Name     : userDetails.ac_desc,
  //               id            : userDetails.id,
  //               // lastname      : userDetails.lname,
  //               status        : 'A'
  //           };
  //           this.utilityApi.authorizeCustomer(JSON.stringify(customer)).subscribe(response =>{
  //             this.splashScreen.hide();
  //             if (response.errCode === 0) {
  //               this.utilityApi.displaySuccess('Customer successfully authorized');
  //             }else {
  //               this.utilityApi.displayFailed('Customer authorization process failed try again later.');
  //             }
  //           },()=>{
  //             this.splashScreen.hide();
  //             this.utilityApi.displayFailed('Customer authorization process failed, server error.');
  //           });
  //           }
  //       });
  //  }


}
