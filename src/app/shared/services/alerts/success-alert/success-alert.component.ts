import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-success-alert',
  templateUrl: './success-alert.component.html',
  styleUrls: ['./success-alert.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class SuccessAlertComponent implements OnInit {

  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<SuccessAlertComponent>
  ) { }

  ngOnInit(): void 
  {

  }

  userAction() : void 
  {
    if(this.data.actions.confirm.show){
      this.matDialogRef.close();
      window.location.reload();
      return;
    }
    if(this.data.actions.confirmRedirect.show){
      this.matDialogRef.close();
      window.location.href = this.data.actions.confirmRedirect.link;
      return;
    }
    if(this.data.actions.confirmNoReload.show){
      this.matDialogRef.close();
      return;
    }
  }

}
