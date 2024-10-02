import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-confirm-user-details',
  templateUrl: './confirm-user-details.component.html',
  styleUrls: ['./confirm-user-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ConfirmUserDetailsComponent implements OnInit {

  user: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public matDialogRef: MatDialogRef<ConfirmUserDetailsComponent>
    ) { 
    this.user = this.data.userDetails;
    console.log(this.user);
  }

  ngOnInit(): void {
  }

}
