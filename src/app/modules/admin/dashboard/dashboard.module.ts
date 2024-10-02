import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'app/shared/shared.module';
import { ProjectResolver } from 'app/modules/admin/dashboard/project.resolvers';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomProgressSpinnerDirective } from 'app/shared/directives/progress-spinner/custom-progress-spinner.directive';

const route: Route[] = [
  {
      path     : '',
      component: DashboardComponent,
      resolve  : {
        data: ProjectResolver
    }
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    CustomProgressSpinnerDirective
  ],
  imports: [
    SharedModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(route)
  ]
})
export class DashboardModule { }
