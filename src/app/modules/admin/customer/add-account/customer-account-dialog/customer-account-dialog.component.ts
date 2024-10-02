import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-customer-account-dialog',
  templateUrl: './customer-account-dialog.component.html',
  styleUrls: ['./customer-account-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class CustomerAccountDialogComponent implements OnInit {

  customer: any;
  accounts: any[] = [];
  linkedAccounts: any[] = [];
  isLoading:boolean = false;
  displayedColumns: string[] = ['action','account_name','account_no','currency'];
  dataSource: MatTableDataSource<any>;
  displayedColumns2: string[] = ['account_no','linked_by','date_linked','status','action'];
  dataSource2: MatTableDataSource<any>;
  master: boolean = false;
  masterDisabled: boolean = false;
  isResultEmpty:boolean = false;
  isUnlinkLoading:boolean = false;
  selectedAccounts: any[] = [];
  username: string;
  branch: string;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private utilityApi: UtilityService,
    private splashScreen: FuseSplashScreenService,
    public matDialogRef: MatDialogRef<CustomerAccountDialogComponent>,
    private confirmationDialog: FuseConfirmationService,
    private authService: AuthService
  ) 
  {
    this.customer = this.data.userDetails;
    this.linkedAccounts = this.data.accounts;
    this.username = this.authService.getLoggedInUserDetails().username;
    this.branch = this.authService.getLoggedInUserDetails().branch;
  }

  ngOnInit(): void 
  {
    this.dataSource = new MatTableDataSource(this.accounts);
    this.dataSource2 = new MatTableDataSource(this.linkedAccounts);
    this.dataSource.sort = this.sort;
    this.dataSource2.sort = this.sort;
  }

  verifyAccount(cif: string) : void 
  {
    if (cif.trim() !== '') {
      this.isLoading = true;
      this.isResultEmpty = false;
      this.masterDisabled = false;
      this.selectedAccounts = [];
      this.utilityApi.findAccountsById(cif).subscribe(response => {
        this.isLoading = false;
        if (response.errCode === 0) {
          this.accounts = response.data.accounts;
          this.accounts.forEach((flexcubeAccount)=>{
            flexcubeAccount.isLinked = false;
            this.linkedAccounts.forEach((linkedAccount)=>{
              if(flexcubeAccount.accountNumber == linkedAccount.accountNo) {
                flexcubeAccount.isLinked = true;
                this.masterDisabled = true;
              }
            });
          });
          this.dataSource = new MatTableDataSource(this.accounts);
          this.dataSource.sort = this.sort;
          if (this.accounts.length === 0) {
            this.isResultEmpty = true;
          }
        }else{
          this.utilityApi.displayError('Unable to fetch customers accounts');
        }
      },()=>{
        this.isLoading = false;
        this.utilityApi.displayError();
      });
    }else {
      this.utilityApi.displayError('Enter customer number (CIF)');
    }
    

  }

  checkUncheckAll(): void {
    this.selectedAccounts = [];
    if (this.master) {
        this.master = true;
        this.dataSource.filteredData.forEach((item) => {
            this.selectedAccounts.push(item);
        });
    } else {
        this.master = false;
    }
    this.dataSource.filteredData.forEach((child) => {
        child.selected = this.master;
    });
  }

  accountIsClicked(account: any): void {
    if (account.selected) {

        this.selectedAccounts.push(account);
        if (this.selectedAccounts.length === this.accounts.length) {
            this.master = true;
        }
    } else {
        this.master = false;
        var selectedIndex = this.selectedAccounts.indexOf(account.accountNumber);
        this.selectedAccounts.splice(selectedIndex, 1);
    }
  }

  saveAccount() : void 
  {
    if (this.selectedAccounts.length === 0) {
      this.utilityApi.displayError('Please select customer account');
    }else {
      const dialogRef = this.confirmationDialog.open({
        "title": "Confirm Account Link",
        "message": `Are you certain about linking account(s) for customer </br><span class="text-lg font-semibold">${this.customer.fname} ${this.customer.lname}?</span>`,
        "icon": {
          "show": true,
          "name": "mat_outline:fact_check",
          "color": "success"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "Save",
            "color": "primary"
          },
          "cancel": {
            "show": true,
            "label": "Back"
          }
        },
        "dismissible": true
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'confirmed') {
          this.splashScreen.show();
          this.matDialogRef.close();
          const finalAccountObj = {
            accountNumbers : this.selectedAccounts.map((selectedVal)=>selectedVal.accountNumber),
            adminUsername : this.username,
            userId : this.customer.id
          };
          this.utilityApi.saveCustomerAccounts(finalAccountObj).subscribe(response => {
            this.splashScreen.hide();
            if(response.errCode === 0) {
              this.utilityApi.displaySuccessRedirect('Customer\'s account saved successfully.','/xmobileadmin/customer-management/customer/add-account')
            }else {
              this.utilityApi.displayFailed(response.errMsg);
            }
          },()=> {
            this.splashScreen.hide();
            this.utilityApi.displayError();
          });
        }
      });

    }
  }

  unlinkCustomerAccount(accountDetail : any) : void
  {
    const dialogRef = this.confirmationDialog.open({
      "title": "Delink Customer Account",
      "message": `This will permanently detach account <span class="font-semibold">(${accountDetail.accountNo})</span> from customer <span class="text-lg font-semibold">${this.customer.fname} ${this.customer.lname}</span>`,
      "icon": {
        "show": true,
        "name": "mat_solid:social_distance",
        "color": "info"
      },
      "actions": {
        "confirm": {
          "show": true,
          "label": "Delink",
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
        this.isUnlinkLoading = true;
        this.utilityApi.unlinkCustomerAccount(accountDetail).subscribe(response =>{
          this.isUnlinkLoading = false;
          if(response.errCode === 0) {
            this.utilityApi.displaySuccessNoReload(`Account was unlinked successfully, click okay to view changes`);
            let updatedLinkedAccounts = [];
            this.linkedAccounts.forEach((account) =>{
              if (account.accountNo !== accountDetail.accountNo) {
                updatedLinkedAccounts.push(account);
              }
            });
            this.linkedAccounts = updatedLinkedAccounts;
            this.dataSource2 = new MatTableDataSource(updatedLinkedAccounts);
          }else {
            this.utilityApi.displayFailed(response.errMsg);
          }
        },()=>{
          this.isUnlinkLoading = false;
          this.utilityApi.displayError();
        });
      }
    });
  }


}
