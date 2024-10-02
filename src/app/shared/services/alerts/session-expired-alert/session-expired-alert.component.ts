import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-session-expired-alert',
  templateUrl: './session-expired-alert.component.html',
  styleUrls: ['./session-expired-alert.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class SessionExpiredAlertComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<SessionExpiredAlertComponent>
  ) { }

  ngOnInit(): void {}

  userAction() : void 
  {
    
    this.matDialogRef.close();
    window.location.href = '/auth/sign-in';
     
  }

}
