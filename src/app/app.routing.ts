import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [

    
    {path: '', pathMatch : 'full', redirectTo: 'ealert/dashboard'},

    // Auth routes for guests
    {
        path: 'auth',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)}
        ]
    },

    // Admin routes
    {
        path       : 'ealert',
        canActivate: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {path: 'dashboard', loadChildren: () => import('app/modules/admin/dashboard/dashboard.module').then(m => m.DashboardModule)},
            {path: 'customer-management', loadChildren: () => import('app/modules/admin/customer/customer.module').then(m => m.CustomerModule)},
            {path: 'user-management', loadChildren: () => import('app/modules/admin/back-office/back-office.module').then(m => m.BackOfficeModule)},
            {path: 'account-management', loadChildren: () => import('app/modules/admin/account/account.module').then(m => m.AccountModule)},
            {path: 'report', loadChildren: () => import('app/modules/admin/report/report.module').then(m => m.ReportModule)},
            {path: 'broadcast', loadChildren: () => import('app/modules/admin/broadcast/broadcast.module').then(m => m.BroadcastModule)},
            {path: 'adhoc', loadChildren: () => import('app/modules/admin/adhoc-statement/adhoc-statement.module').then(m => m.AdhocStatementModule)},
            {path: 'settings', loadChildren: () => import('app/modules/admin/settings/settings.module').then(m => m.SettingsModule)},
            {path: 'system-activities', loadChildren: () => import('app/modules/admin/system-activities/system-activities.module').then(m => m.SystemActivitiesModule)},
            {path: 'charges', loadChildren: () => import('app/modules/admin/charges/charges.module').then(m => m.ChargesModule)},
        ]
    },
    // Wild card routes
    {path: '**', redirectTo: 'ealert/dashboard'},
];
