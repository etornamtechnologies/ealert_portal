import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Route, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import {ChargeManagementComponent} from './charges-management/charge.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangeThemeComponent } from './change-theme/change-theme.component';
import { DepartmentsComponent } from './departments/departments.component';
import { TransactionExemptionsComponent } from './transaction-exemptions/transaction-exemptions.component';

const route: Route[] = [
  {
    path     : 'department',
    component: DepartmentsComponent
  },
  {
    path     : 'transaction-exemption',
    component: TransactionExemptionsComponent
  },
  {
      path     : 'change-password',
      component: ChangePasswordComponent
  },
  {
    path     : 'profile',
    component: ProfileComponent
  },
  {
    path     : 'change-theme',
    component: ChangeThemeComponent
  },
  {
    path:'charge-managment',
    component:ChargeManagementComponent
  }
];

@NgModule({
  declarations: [
    ChangePasswordComponent,
    ProfileComponent,
    ChangeThemeComponent,
    DepartmentsComponent,
    TransactionExemptionsComponent,
    ChargeManagementComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class SettingsModule { }
