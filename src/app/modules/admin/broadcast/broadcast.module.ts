import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Route, RouterModule } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BroadcastSmsComponent } from './broadcast-sms/broadcast-sms.component';
import { BroadcastEmailComponent } from './broadcast-email/broadcast-email.component';
import { AuthorizeBroadcastSmsComponent } from './authorize-broadcast-sms/authorize-broadcast-sms.component';
import { AuthorizeBroadcastEmailComponent } from './authorize-broadcast-email/authorize-broadcast-email.component';
import { BroadcastContactComponent } from './broadcast-contact/broadcast-contact.component';
import { UploadContactComponent } from './broadcast-contact/upload-contact/upload-contact.component';
import { SingleContactComponent } from './broadcast-contact/single-contact/single-contact.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';

const route: Route[] = [
  {
    path     : 'sms',
    component: BroadcastSmsComponent
  },
  {
    path     : 'email',
    component: BroadcastEmailComponent
  },
  {
      path     : 'authorize-sms',
      component: AuthorizeBroadcastSmsComponent
  },
  {
    path     : 'authorize-email',
    component: AuthorizeBroadcastEmailComponent
  },
  {
    path     : 'contacts',
    component: BroadcastContactComponent
  }
];

@NgModule({
  declarations: [
    BroadcastSmsComponent,
    BroadcastEmailComponent,
    AuthorizeBroadcastSmsComponent,
    AuthorizeBroadcastEmailComponent,
    BroadcastContactComponent,
    UploadContactComponent,
    SingleContactComponent
  ],
  imports: [
    SharedModule,
    NgxMaterialTimepickerModule,
    RouterModule.forChild(route)
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class BroadcastModule { }
