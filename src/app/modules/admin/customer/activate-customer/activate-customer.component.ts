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
  selector: 'app-activate-customer',
  templateUrl: './activate-customer.component.html',
  styleUrls: ['./activate-customer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ActivateCustomerComponent implements OnInit {

  displayedColumns: string[] = ['firstname','lastname','email','account_no','phone','actions'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  customers: any[] = [];
  AdvanceSearch: FormGroup;
  userBranch: string;
  username: string;
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
      this.AdvanceSearch = this._formBuilder.group({
        SearchOption  : ['',Validators.required],
        SearchValue   : ['']
      });
      this.userBranch = this.authService.getLoggedInUserDetails().branch;
      this.username = this.authService.getLoggedInUserDetails().username;
   }

  ngOnInit(): void 
  {
    this.getDeactivatedCustomers(this.userBranch).then(response => {
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
          this.utilityApi.displayError('Unable to fetch disabled customers');
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
    });
  }

  getDeactivatedCustomers(branch : string) : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getAllDeactivatedCustomers(branch)
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
      this.utilityApi.searchCustomerByStatus(JSON.stringify(searchObj)).subscribe(response =>{
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

  unblockCustomer(userDetails : any) : void 
  {
      const dialogRef = this.confirmationDialog.open({
        "title": "Enable Customer",
        "message": `Are you sure you want to enable this customer </br><span class="text-lg font-semibold">${userDetails.fname} ${userDetails.lname}?</span>`,
        "icon": {
          "show": true,
          "name": "mat_outline:fact_check",
          "color": "success"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "Enable",
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
              const customer = {
                  accountNumber : userDetails.accountNumber,
                  adminUsername : this.username,
                  firstname     : userDetails.fname,
                  id            : userDetails.id,
                  lastname      : userDetails.id,
                  status        : 'A'
              };
              this.utilityApi.updateCustomerStatus(JSON.stringify(customer)).subscribe(response =>{
                this.splashScreen.hide();
                if (response.errCode === 0) {
                  this.utilityApi.displaySuccess('Customer enabled successfully');
                }else {
                  this.utilityApi.displayFailed('Customer enabling process failed try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('Customer enabling process failed, server error.');
              });
            }
        });
  }

  viewCustomerDetails(userDetails : any) : void 
  {
    this.dialogRef = this._matDialog.open(ViewCustomerDetailsComponent,{
      data: {
        userDetails
       },
      width : '500px',
      disableClose: false
    });
  }

}
