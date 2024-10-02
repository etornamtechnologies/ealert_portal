import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-confirm-customer-details',
  templateUrl: './confirm-customer-details.component.html',
  styleUrls: ['./confirm-customer-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ConfirmCustomerDetailsComponent implements OnInit {

  customer: any;

  constructor(@Inject(
    MAT_DIALOG_DATA) private data: any,
    public matDialogRef: MatDialogRef<ConfirmCustomerDetailsComponent>) { 
    this.customer = this.data.customerDetails;
  }

  ngOnInit(): void 
  {

  }

}
