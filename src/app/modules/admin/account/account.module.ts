import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Route, RouterModule } from '@angular/router';
import { AccountExemptionComponent } from './account-exemption/account-exemption.component';
import { AccountClassExemptionComponent } from './account-class-exemption/account-class-exemption.component';
import { AccountDeactivationComponent } from './account-deactivation/account-deactivation.component';

const route: Route[] = [
  {
    path     : 'account-exemption',
    component: AccountExemptionComponent
  },
  {
    path     : 'account-class-exemption',
    component: AccountClassExemptionComponent
  },
  {
    path     : 'account-deactivation',
    component: AccountDeactivationComponent
  }
];

@NgModule({
  declarations: [
    AccountExemptionComponent,
    AccountClassExemptionComponent,
    AccountDeactivationComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class AccountModule { }
