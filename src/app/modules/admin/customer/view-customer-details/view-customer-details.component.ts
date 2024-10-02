import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-view-customer-details',
  templateUrl: './view-customer-details.component.html',
  styleUrls: ['./view-customer-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ViewCustomerDetailsComponent implements OnInit {

  customer: any;
  accounts:any[] = [];
  isLoading:boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private utilityApi: UtilityService,
    public matDialogRef: MatDialogRef<ViewCustomerDetailsComponent>
  ) {
      this.customer = this.data.userDetails;
      console.log(this.customer);
    }

  ngOnInit(): void 
  {
    this.utilityApi.getCustomersAccount(this.customer.id).subscribe(response =>{
      this.isLoading = false;
      this.accounts = response.data.accounts;
    },()=>this.isLoading = false);
  }

}
