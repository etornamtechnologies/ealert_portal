import { Component, ElementRef, EventEmitter, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { AppStore } from 'app/shared/localstorage-helper';
import { UtilityService } from 'app/shared/services/utility.service';
// import { ViewCustomerDetailsComponent } from '../view-customer-details/view-customer-details.component';
import * as XLSX from "xlsx";

@Component({
  selector: 'customer-report',
  templateUrl: './customer-report.component.html',
  styleUrls: ['./customer-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class CustomerReport implements OnInit {

  displayedColumns: string[] = ['accNo','custId','custPhoneNumber','preferedPhone','custEmail','monthlyStmnt','emailAlert','smsAlert','createdOn','modifiedOn'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  customers: any[] = [];
  userBranch: string;
  username: string;
  role: string;
  AdvanceSearch: FormGroup;
  // dialogRef: MatDialogRef<ViewCustomerDetailsComponent>;
  confrimdeact: boolean =true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;
  
  constructor(
    private utilityApi: UtilityService,
    private splashScreen: FuseSplashScreenService,
    private renderer: Renderer2,
    private _formBuilder: FormBuilder,
    private route: Router, 
    private confirmationDialog: FuseConfirmationService,
    private _matDialog: MatDialog,
    private authService: AuthService
  ) {
      this.userBranch = this.authService.getLoggedInUserDetails().branch;
      this.username = this.authService.getLoggedInUserDetails().username;
      this.role = this.authService.getLoggedInUserDetails().roleId;
      this.AdvanceSearch = this._formBuilder.group({
        StartDate     : [''],
        EndDate       : [''],
        SearchOption  : [''],
        SearchValue   : ['']
      });
    }

  ngOnInit(): void 
  {

    this.isLoading = false;
    // this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');

}

  getCustomers(branch: string) : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.GET_ALL_CUST()
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
      if((this.AdvanceSearch.value.StartDate=='' && this.AdvanceSearch.value.SearchOption === '' ) || (this.AdvanceSearch.value.SearchOption !== '' && this.AdvanceSearch.value.SearchValue === '')) {
        this.utilityApi.displayFailed('Please enter a search value or Input date range','Atleast, one filter value Required');
        return;
      }
      this.isResultEmpty = false;
      let startdate = (this.AdvanceSearch.value.StartDate._i['date']).toString().padStart(2, "0") + '/' + (this.AdvanceSearch.value.StartDate._i['month']+1).toString().padStart(2, "0") + '/' + this.AdvanceSearch.value.StartDate._i['year']
      let enddate   = (this.AdvanceSearch.value.EndDate._i['date']).toString().padStart(2, "0") + '/' +   (this.AdvanceSearch.value.EndDate._i['month'] +1).toString().padStart(2, "0") + '/'  + this.AdvanceSearch.value.EndDate._i['year']
      const searchObj = {
        startDate  : startdate,
        endDate  : enddate,
        filterBy : this.AdvanceSearch.value.SearchOption,
        filter : this.AdvanceSearch.value.SearchValue
      };
      this.isLoading = true;
      this.renderer.addClass(this.tableDivView.nativeElement,'hidden');
      this.utilityApi.searchAllRegCustomer(JSON.stringify(searchObj)).subscribe(response =>{
        if (response.code === 200) {
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
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
          this.utilityApi.displayFailed(response.message);
        }
      },()=> {
        this.isLoading = false;
        this.utilityApi.displayError('Unable to fetch customers');
        this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
      });
    }
  }

 

  editCustomer(cusDetails : any) : void 
  {
    AppStore.set('editCustomerData',JSON.stringify(cusDetails));
    this.route.navigate(['/xmobileadmin/customer-management/customers','edit',btoa(cusDetails)]);
  }



  unauthorizeCustomer(custDetails : any) : void 
  {
    
      const dialogRef = this.confirmationDialog.open({
        "title": "Delete Customer",
        "message": `Are you sure you want to remove this customer </br><span class="text-lg font-semibold">${custDetails.acDesc}</span> from the system?<br><span><input matInput name="reason"></span>`,
        "icon": {
          "show": true,
          "name": "heroicons_outline:trash",
          "color": "warn"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "Deactivate",
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
              const data_main = {
                opn    : 0,
                reason : 'ABOZIGI',
                accNo  : custDetails.custAcNo
            };
            // this.utilityApi.deleteCustomerById(userDetails.custNo,JSON.stringify(admin)).subscribe(response =>{
            this.utilityApi.unregisterCustomer(JSON.stringify(data_main)).subscribe(response =>{
              this.splashScreen.hide();
              if (response.code === 200) {
                this.utilityApi.displaySuccess('Customer deactivtaed successfully');
              }else {
                this.utilityApi.displayFailed(response.message + 'Customer unable to delete, try again later.');
              }
            },()=>{
              this.splashScreen.hide();
              this.utilityApi.displayFailed('Customer unable to deactivate, server error.');
            });
            }
        });
  }

  authorizeCustomer(userDetails : any) : void 
  {
      const dialogRef = this.confirmationDialog.open({
        "title": "Delete Customer",
        "message": `Are you sure you want to remove this customer </br><span class="text-lg font-semibold">${userDetails.acDesc}</span> from the system?<br><span><input matInput name="reason"></span>`,
        "icon": {
          "show": true,
          "name": "heroicons_outline:trash",
          "color": "warn"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "Delete",
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
              const admin = {
                username : this.username
            };
            // this.utilityApi.deleteCustomerById(userDetails.custNo,JSON.stringify(admin)).subscribe(response =>{
            this.utilityApi.unregisterCustomerById(userDetails.custNo,JSON.stringify(admin)).subscribe(response =>{
              this.splashScreen.hide();
              if (response.errCode === 0) {
                this.utilityApi.displaySuccess('Customer deactivtaed successfully');
              }else {
                this.utilityApi.displayFailed('Customer unable to delete, try again later.');
              }
            },()=>{
              this.splashScreen.hide();
              this.utilityApi.displayFailed('Customer unable to deactivate, server error.');
            });
            }
        });
  }

  resetCustomerPassword(userDetails : any) : void 
  {
      const dialogRef = this.confirmationDialog.open({
        "title": "Reset Customer Password",
        "message": `Are you sure you want to reset password for </br><span class="text-lg font-semibold">${userDetails.acDesc} ${userDetails.acDesc}</span>?`,
        "icon": {
          "show": true,
          "name": "heroicons_outline:logout",
          "color": "success"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "Reset Password",
            "color": "primary"
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
              this.utilityApi.resetCustomerPassword(JSON.stringify(userDetails)).subscribe(response =>{
                this.splashScreen.hide();
                if (response.errCode === 0) {
                  this.utilityApi.displaySuccess('Customer password was reset successfully');
                }else {
                  this.utilityApi.displayFailed('Customer password could not be reset, try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('Customer password could not be reset, server error.');
              });
            }
        });
  }

  // fetach_cus_data_for_edit
  edit_authorizeAccount(cust_details : any): void  
  {
    if (cust_details !== '') {
      this.splashScreen.show();
      const accountParam = {
        accOrName : cust_details.custAcNo,
        searchMode: 'AccountRegistration'
      };
      this.utilityApi.fetchRegesteredAccDetails(cust_details.custAcNo).subscribe(response =>{
        this.splashScreen.hide();
        if(response.code === 200) {
          // this.custdata = response.data;
          AppStore.set('editCustomerData',JSON.stringify(response.data));
          this.route.navigate(['/ealert/customer-management/customers','editAccount',btoa(response.data.custNo)]);
          // return response.data[0];
        }
        else {
          this.utilityApi.displayFailed(response.errMsg,'Cutomer details featch failed');
          // return ''
           
        }
      },()=> {
        this.splashScreen.hide();
        this.utilityApi.displayFailed('Customer account details failed');
        // return ''
      });
    }
    
  }


  exportToExcel(): void {
    
    const workSheet = XLSX.utils.json_to_sheet(
        this.dataSource.filteredData
    );
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
    XLSX.writeFile(workBook, "filename.xlsx");
}



  edit_authorizeCustomer(cust_details : any): void  
  {
    if (cust_details !== '') {
      this.splashScreen.show();
      const accountParam = {
        accOrName : cust_details.custAcNo,
        searchMode: 'CustomerRegistration'
      };
      this.utilityApi.fetchUpdateCusDetailsbycustid(cust_details.custNo,cust_details.custAcNo).subscribe(response =>{
        this.splashScreen.hide();
        if(response.code === 200) {
          // this.custdata = response.data;
          AppStore.set('editCustomerData',JSON.stringify(response.data));
          this.route.navigate(['/ealert/customer-management/customers','edit',btoa(response.data.custNo)]);
          // return response.data[0];
        }
        else {
          this.utilityApi.displayFailed(response.errMsg,'Cutomer details featch failed');
          // return ''
           
        }
      },()=> {
        this.splashScreen.hide();
        this.utilityApi.displayFailed('Customer account details failed');
        // return ''
      });
    }
    
  }

}




@Component({
  selector: 'dialog-component',
  template: `<h2>{{title}}</h2>
      <p>{{message}}</p><div class="example-full-width"><input matInput placeholder="Deactivate reason" #input></div>
      <button mat-button (click)="onOk.emit(input.value); ">OK</button>`
})
export class DialogComponent {

  public title: string;
  public message: string;
  onOk = new EventEmitter();

  constructor( 
    // public dialog: MatDialogRef<ErrorDialogComponent>
    ) { }
}
