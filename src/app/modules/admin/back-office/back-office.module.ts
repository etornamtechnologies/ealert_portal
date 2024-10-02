import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Route, RouterModule } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ActivateUserComponent } from './activate-user/activate-user.component';
import { DeactivateUserComponent } from './deactivate-user/deactivate-user.component';
import { AuthorizeUserComponent } from './authorize-user/authorize-user.component';
import { UnlockUserComponent } from './unlock-user/unlock-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ConfirmUserDetailsComponent } from './add-user/confirm-user-details/confirm-user-details.component';

const route: Route[] = [
  {
      path     : 'users',
      component: ManageUserComponent
  },
  {
    path     : 'user/create',
    component: AddUserComponent
  },
  {
    path     : 'user/authorize',
    component: AuthorizeUserComponent
  },
  {
    path     : 'user/unblock',
    component: ActivateUserComponent
  },
  {
    path     : 'user/block',
    component: DeactivateUserComponent
  },
  {
    path     : 'user/unlock',
    component: UnlockUserComponent
  },
  {
    path     : 'users/edit/:userId',
    component: EditUserComponent
  }
];

@NgModule({
  declarations: [
    AddUserComponent,
    ManageUserComponent,
    ActivateUserComponent,
    DeactivateUserComponent,
    AuthorizeUserComponent,
    UnlockUserComponent,
    EditUserComponent,
    ConfirmUserDetailsComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(route)
  ],
  entryComponents: [
    ConfirmUserDetailsComponent
  ]
})
export class BackOfficeModule { }
