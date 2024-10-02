import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SharedModule } from 'app/shared/shared.module';
import { Route, RouterModule } from '@angular/router';
import { ChequeBookRequestComponent } from './cheque-book-request/cheque-book-request.component';
import { ActivityHistoryComponent } from './activity-history/activity-history.component';
import { CollectionUsersComponent } from './collection-users/collection-users.component';
import { CreateCollectionUserComponent } from './create-collection-user/create-collection-user.component';
import { EditCollectionUserComponent } from './edit-collection-user/edit-collection-user.component';
import { ConfirmCollectionUserDetailsComponent } from './create-collection-user/confirm-collection-user-details/confirm-collection-user-details.component';
import { ViewCollectionUserComponent } from './view-collection-user/view-collection-user.component';

const route: Route[] = [
  {
    path     : 'collection-users',
    component: CollectionUsersComponent
  },
  {
    path     : 'collection-users/create',
    component: CreateCollectionUserComponent
  },
  {
    path     : 'collection-users/edit/:userId',
    component: EditCollectionUserComponent
  },
  {
    path     : 'activity-history',
    component: ActivityHistoryComponent
  },
  {
    path     : 'chequebook-request',
    component: ChequeBookRequestComponent
  }
];

@NgModule({
  declarations: [
    ChequeBookRequestComponent,
    ActivityHistoryComponent,
    CollectionUsersComponent,
    CreateCollectionUserComponent,
    EditCollectionUserComponent,
    ConfirmCollectionUserDetailsComponent,
    ViewCollectionUserComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(route)
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  entryComponents: [
    ConfirmCollectionUserDetailsComponent
  ]
})
export class SystemActivitiesModule { }
