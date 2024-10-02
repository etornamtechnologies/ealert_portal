import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-unlock-customer',
  templateUrl: './unlock-customer.component.html',
  styleUrls: ['./unlock-customer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class UnlockCustomerComponent implements OnInit {

  displayedColumns: string[] = ['firstname','lastname','email','account_no','phone','actions'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  customers: any[] = [];
  userBranch: string;
  AdvanceSearch: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;
  
  constructor(
    private utilityApi: UtilityService,
    private splashScreen: FuseSplashScreenService,
    private renderer: Renderer2,
    private _formBuilder: FormBuilder,
    private confirmationDialog: FuseConfirmationService,
    private authService: AuthService
  ) {
    this.AdvanceSearch = this._formBuilder.group({
      SearchOption  : ['',Validators.required],
      SearchValue   : ['']
    });
    this.userBranch = this.authService.getLoggedInUserDetails().branch;
   }

  ngOnInit(): void 
  {
    this.getLockedCustomers(this.userBranch).then(response => {
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
          this.utilityApi.displayError('Unable to fetch locked customers');
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
    });
  }

  getLockedCustomers(branch : string) : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getLockedCustomers(branch)
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
        status : 'Y'
      };
      this.isLoading = true;
      this.renderer.addClass(this.tableDivView.nativeElement,'hidden');
      this.utilityApi.searchCustomerByLockedStatus(JSON.stringify(searchObj)).subscribe(response =>{
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

  unlockCustomer(userDetails : any) : void 
  {
      const dialogRef = this.confirmationDialog.open({
        "title": "Unlock Customer",
        "message": `Are you sure you want to unlock this customer </br><span class="text-lg font-semibold">${userDetails.fname} ${userDetails.lname}?</span>`,
        "icon": {
          "show": true,
          "name": "heroicons_outline:lock-open",
          "color": "warning"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "Unlock",
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
              this.utilityApi.unlockCustomer('N',userDetails.id).subscribe(response =>{
                this.splashScreen.hide();
                if (response.errCode === 0) {
                  this.utilityApi.displaySuccess('Customer was unlocked successfully');
                }else {
                  this.utilityApi.displayFailed('Customer unlock process failed try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('Customer unlock process failed, server error.');
              });
            }
        });
    }

}
