import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SharedModule } from 'app/shared/shared.module';
import { Route, RouterModule } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TransactionReportComponent } from './transaction-report/transaction-report.component';
import { SmsReportComponent } from './sms-report/sms-report.component';
import { ExpressPayMonthlyReportComponent } from './express-pay-monthly-report/express-pay-monthly-report.component';
import { SubscriberReportComponent } from './subscriber-report/subscriber-report.component';
import { OtpReportComponent } from './otp-report/otp-report.component';
import { GipReportComponent } from './gip-report/gip-report.component';
import { EmailReportComponent } from './email-report/email-report.component';
import {BroadcastReportComponent} from './broadcast-report/broadcast-report.component'
import {SmsBroadcastReport} from './broadcast-report/sms-report/broadcast.sms.component';
import {EmailBroadcastReport} from './broadcast-report/email-report/broadcast.email.component';
import { ActivityReportComponent } from './activity-report/activity-report.component';
import { CustomerReport } from './customer-report/customer-report.component';
import { ChargesReportComponent } from './charges-report/charges-report.component';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar/public-api';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AlertSummaryReportComponent } from './alert-summary-report/alert-summary-report.component'
import { BirthdaySmsReportComponent } from './birthday-sms-report/birthday-sms-report.component'
import { BirthdayEmailReportComponent } from './birthday-email-report/birthday-email-report.component'
import { NewAccountOpeningSmsReportComponent } from './new-account-opening-sms-report/new-account-opening-sms-report.component'
import { NewAccountOpeningEmailReportComponent } from './new-account-opening-email-report/new-account-opening-email-report.component'

const route: Route[] = [
  {
      path     : 'transactions',
      component: TransactionReportComponent
  },
  {
    path: 'alert-summary',
    component: AlertSummaryReportComponent
  },
  {
    path     : 'sms',
    component: SmsReportComponent
  },
  {
    path     : 'gip',
    component: GipReportComponent
  },
  {
    path     : 'otp',
    component: OtpReportComponent
  },
  {
    path     : 'email',
    component: EmailReportComponent
  },
  {
    path   : 'birthday-sms',
    component: BirthdaySmsReportComponent
  },
  {
    path   : 'birthday-email',
    component: BirthdayEmailReportComponent
  },
  {
    path   : 'new-account-opening-sms',
    component: NewAccountOpeningSmsReportComponent
  },
  {
    path   : 'new-account-opening-email',
    component: NewAccountOpeningEmailReportComponent
  },
  {
    path     : 'subscribers',
    component: SubscriberReportComponent
  },
  {
    path     : 'expresspay',
    component: ExpressPayMonthlyReportComponent
  },
  {
    path     : 'broadcast',
    component: BroadcastReportComponent
  },
  {

  path     : 'customers',
  component: CustomerReport
  },
  {
    path      : 'activity-log' ,
    component : ActivityReportComponent
  },
  {
    path      : 'charges' ,
    component : ChargesReportComponent
  }
];

@NgModule({
  declarations: [
    TransactionReportComponent,
    SmsReportComponent,
    ExpressPayMonthlyReportComponent,
    SubscriberReportComponent,
    OtpReportComponent,
    GipReportComponent,
    EmailReportComponent,
    BroadcastReportComponent,
    SmsBroadcastReport,
    EmailBroadcastReport,
    CustomerReport,
    ActivityReportComponent,
    ChargesReportComponent,
    AlertSummaryReportComponent,
    BirthdaySmsReportComponent,
    BirthdayEmailReportComponent,
    NewAccountOpeningSmsReportComponent,
    NewAccountOpeningEmailReportComponent
  ],
  imports: [
    SharedModule,
    FuseScrollbarModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    NgxMaterialTimepickerModule,   
     RouterModule.forChild(route)
  ],
  entryComponents: [
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatPaginatorModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class ReportModule { }
