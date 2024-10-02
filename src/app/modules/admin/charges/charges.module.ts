import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChargeConfigurationComponent } from './charge-configuration/charge-configuration.component';
import { ProcessChargeComponent } from './process-charge/process-charge.component';
import { SharedModule } from 'app/shared/shared.module';
import { Route, RouterModule } from '@angular/router';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';


const route: Route[] = [
  {
    path     : 'configuration',
    component: ChargeConfigurationComponent
  },
  {
    path     : 'process',
    component: ProcessChargeComponent
  }
];

@NgModule({
  declarations: [
    ChargeConfigurationComponent,
    ProcessChargeComponent,
  ],
  
  imports: [
    SharedModule,
    FuseScrollbarModule,
    CommonModule,
    RouterModule.forChild(route),
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
  ]
})
export class ChargesModule { }
