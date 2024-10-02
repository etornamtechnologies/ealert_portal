import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { UtilityService } from 'app/shared/services/utility.service';
import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'app-verify-customer',
  templateUrl: './verify-customer.component.html',
  styleUrls: ['./verify-customer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class VerifyCustomerExemptionComponent implements OnInit {

  accounts: any[] = [];
  Username:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public matDialogRef: MatDialogRef<VerifyCustomerExemptionComponent>,
    private utilityApi: UtilityService, 
    private splashScreen: FuseSplashScreenService,
    private confirmationDialog: FuseConfirmationService,
    private authService: AuthService
    
  ) {
      this.accounts = this.data.accounts;
      this.Username = this.authService.getLoggedInUserDetails().username;
    }

  ngOnInit(): void 
  {
    console.log( this.accounts);
  }


  SubmitCustomer()
    // this.utilityApi.createCustomerBulk(JSON.stringify(this.customers)).subscribe(response =>{
  {
        const dialogRef = this.confirmationDialog.open({
          "title": "Bulk Customer Exemption",
          "message": `Kindly verify details of customer before submission  </br><span class="text-lg font-semibold">Total of:${this.accounts.length} ?</span>`,
          "icon": {
            "show": true,
            "name": "mat_outline:library_add_check",
            "color": "info"
          },
          "actions": {
            "confirm": {
              "show": true,
              "label": "Submit",
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
                const custlist={
                  customers : this.accounts
                };
              this.utilityApi.exemptCustomerBulk(JSON.stringify(custlist)).subscribe(response =>{
                this.splashScreen.hide();
                if (response.code === 200) {
                  this.utilityApi.displaySuccess('Customer exemption successfully uploaded');
                }else {
                  this.utilityApi.displayFailed('Customer exemption submission process failed try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('Customer exemption process failed, server error.');
              });
              }
          });
     }


  fetchCustomerDetail(customer : any) : void
  {
    this.splashScreen.show();
    this.utilityApi.getCustomerInfoByAcctNo(customer.accountNumber).subscribe(response =>{
      this.splashScreen.hide();
      if(response.code === 200) {
        this.matDialogRef.close(response.data);
      }else{
        this.utilityApi.displayFailed(`Error Encountered: ${response.message}`);
      }
    });
  }

}
