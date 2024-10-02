import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AlertDialogService } from './alert-dialog.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FailureAlertComponent } from './failure-alert/failure-alert.component';
import { SuccessAlertComponent } from './success-alert/success-alert.component';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SessionExpiredAlertComponent } from './session-expired-alert/session-expired-alert.component';



@NgModule({
  declarations: [
    FailureAlertComponent,
    SuccessAlertComponent,
    SessionExpiredAlertComponent
  ],
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatDividerModule,
    CommonModule,
    FlexLayoutModule
  ],
  providers   : [
    AlertDialogService,
    DatePipe
  ]
})
export class AlertsModule { }
