import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-verify-customer',
  templateUrl: './verify-customer.component.html',
  styleUrls: ['./verify-customer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class VerifyCustomerComponent implements OnInit {

  accounts: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public matDialogRef: MatDialogRef<VerifyCustomerComponent>,
    private utilityApi: UtilityService, 
    private splashScreen: FuseSplashScreenService,
  ) {
      this.accounts = this.data.accounts;
    }

  ngOnInit(): void 
  {

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
