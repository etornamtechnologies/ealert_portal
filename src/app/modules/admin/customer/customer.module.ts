import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SharedModule } from 'app/shared/shared.module';
import { Route, RouterModule } from '@angular/router';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { ManageCustomerComponent } from './manage-customer/manage-customer.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { ActivateCustomerComponent } from './activate-customer/activate-customer.component';
import { AuthorizeCustomerComponent } from './authorize-customer/authorize-customer.component';
import { DeactivateCustomerComponent } from './deactivate-customer/deactivate-customer.component';
import { UnlockCustomerComponent } from './unlock-customer/unlock-customer.component';
import { CustomerAccountDialogComponent } from './add-account/customer-account-dialog/customer-account-dialog.component';
import { CustomerComplaintsComponent } from './customer-complaints/customer-complaints.component';
import { ViewCustomerDetailsComponent } from './view-customer-details/view-customer-details.component';
import { VerifyCustomerComponent } from './add-customer/verify-customer/verify-customer.component';
import { VerifyCustomerExemptionComponent } from './customer-exemption/verify-customer/verify-customer.component';
import { ConfirmCustomerDetailsComponent } from './add-customer/confirm-customer-details/confirm-customer-details.component';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar/public-api';
import { CustomerExemptionComponent } from './customer-exemption/customer-exemption.component';
import { BulkCustomerRegistrationComponent } from './bulk-customer-registration/bulk-customer-registration.component';
import { CommonModule } from '@angular/common';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

const route: Route[] = [
  {
      path     : 'customers',
      component: ManageCustomerComponent
  },
  {
    path     : 'customer/create',
    component: AddCustomerComponent
  },
  {
    path     : 'customer/create/bulk',
    component: BulkCustomerRegistrationComponent
  },
  {
    path     : 'customer/add-account',
    component: AddAccountComponent
  },
  {
    path     : 'customer/authorize',
    component: AuthorizeCustomerComponent
  },
  {
    path     : 'customer/unblock',
    component: ActivateCustomerComponent
  },
  {
    path     : 'customer/block',
    component: DeactivateCustomerComponent
  },
  {
    path     : 'customer/unlock',
    component: UnlockCustomerComponent
  },
  {
    path     : 'customers/edit/:customerId',
    component: EditCustomerComponent
  },
  {
    path: 'customers/editAccount/:customerId',
    component:EditAccountComponent
  },
  {
    path     : 'customer-complaints',
    component: CustomerComplaintsComponent
  },
  {
    path     : 'customer-exemption',
    component: CustomerExemptionComponent
  }
];

@NgModule({
  declarations: [
    AddCustomerComponent,
    ManageCustomerComponent,
    AddAccountComponent,
    EditCustomerComponent,
    ActivateCustomerComponent,
    AuthorizeCustomerComponent,
    DeactivateCustomerComponent,
    UnlockCustomerComponent,
    CustomerAccountDialogComponent,
    CustomerComplaintsComponent,
    ViewCustomerDetailsComponent,
    VerifyCustomerComponent,
    VerifyCustomerExemptionComponent,
    ConfirmCustomerDetailsComponent,
    EditAccountComponent,
    CustomerExemptionComponent,
    BulkCustomerRegistrationComponent
  ],
  imports: [
    SharedModule,
    FuseScrollbarModule,
    CommonModule ,
    RouterModule.forChild(route),
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  entryComponents: [
    CustomerAccountDialogComponent,
    ViewCustomerDetailsComponent,
    ConfirmCustomerDetailsComponent,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class CustomerModule { }
