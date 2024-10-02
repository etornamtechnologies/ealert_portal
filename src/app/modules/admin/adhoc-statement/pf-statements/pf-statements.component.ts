// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-pf-statements',
//   templateUrl: './pf-statements.component.html',
//   styleUrls: ['./pf-statements.component.scss']
// })
// export class PfStatementsComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
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

@Component({
    selector: 'app-pf-statements',
    templateUrl: './pf-statements.component.html',
    styleUrls: ['./pf-statements.component.scss']
  })
  export class PfStatementsComponent implements OnInit {

  displayedColumns: string[] = ['account_desc','account_no','cust_id','actions'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  customers: any[] = [];
  userBranch: string;
  username: string;
  AdvanceSearch: FormGroup;
  //dialogRef: MatDialogRef<ViewCustomerDetailsComponent>;

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
      SearchValue  : ['',Validators.required]
    });
  }

  ngOnInit(): void 
  {
    this.getUnauthorizedCustomers('D',this.userBranch).then(response => {
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
      this.utilityApi.getCustomersByAuthStat(status,branch)
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

  authorizeCustomer(userDetails : any) : void 
  {
      const dialogRef = this.confirmationDialog.open({
        "title": "Generate Customer Statement",
        "message": `Are you sure you want to generate statement for this customer </br><span class="text-lg font-semibold">${userDetails.fname} ${userDetails.lname}?</span>`,
        "icon": {
          "show": true,
          "name": "mat_outline:library_add_check",
          "color": "info"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "Generate",
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
                accountNumber : userDetails.accountNumber,
                adminUsername : this.username,
                firstname     : userDetails.fname,
                id            : userDetails.id,
                lastname      : userDetails.lname,
                status        : 'A'
            };
            this.utilityApi.authorizeCustomer(JSON.stringify(customer)).subscribe(response =>{
              this.splashScreen.hide();
              if (response.errCode === 0) {
                this.utilityApi.displaySuccess('Customer successfully authorized');
              }else {
                this.utilityApi.displayFailed('Customer authorization process failed try again later.');
              }
            },()=>{
              this.splashScreen.hide();
              this.utilityApi.displayFailed('Customer authorization process failed, server error.');
            });
            }
        });
   }

   /* viewCustomerDetails(userDetails : any) : void 
   {
    this.dialogRef = this._matDialog.open(ViewCustomerDetailsComponent,{
      data: {
        userDetails
       },
      width : '500px',
      disableClose: false
    });
   } */

}
