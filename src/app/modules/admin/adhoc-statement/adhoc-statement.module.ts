import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Route, RouterModule } from '@angular/router';
import { EStatementsComponent } from './e-statements/e-statements.component';
import { PfStatementsComponent } from './pf-statements/pf-statements.component';

const route: Route[] = [
  {
    path     : 'estatement',
    component: EStatementsComponent
  },
  {
    path     : 'pfstatement',
    component: PfStatementsComponent
  }
];

@NgModule({
  declarations: [
    EStatementsComponent,
    PfStatementsComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(route)
  ],
})
export class AdhocStatementModule { }
