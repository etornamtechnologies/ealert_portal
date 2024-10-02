import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-confirm-collection-user-details',
  templateUrl: './confirm-collection-user-details.component.html',
  styleUrls: ['./confirm-collection-user-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ConfirmCollectionUserDetailsComponent implements OnInit {

  user: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public matDialogRef: MatDialogRef<ConfirmCollectionUserDetailsComponent>
    ) { 
    this.user = this.data.collectionUser;
  }

  ngOnInit(): void {}

}
