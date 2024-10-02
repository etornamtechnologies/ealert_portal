import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { merge } from 'lodash-es';
import { FailureAlertComponent } from './failure-alert/failure-alert.component';
import { SessionExpiredAlertComponent } from './session-expired-alert/session-expired-alert.component';
import { SuccessAlertComponent } from './success-alert/success-alert.component';

@Injectable({
  providedIn: 'root'
})
export class AlertDialogService {

  private _defaultConfig: any = {
    title      : 'Success',
    message    : 'successfully completed',
    actions    : {
        confirm: {
            show : true,
            label: 'Okay',
            color: 'primary'
        },
        confirmRedirect : {
            show : false,
            label: 'Okay',
            color: 'primary',
            link: '/xmobileadmin/dashboard'
        },
        confirmNoReload : {
          show : false,
          label: 'Okay',
          color: 'primary'
      }
    },
    dismissible: false
};
    private _failedDefaultConfig: any = {
      title      : 'Process Failed',
      message    : 'Could not complete',
      actions    : {
        
          close : {
              show : true,
              label: 'Close'
          }
      },
      dismissible: false
    };

    private _sessionExpiredDefaultConfig: any = {
      title      : 'Your Session Expired',
      message    : 'Click the button below to sign in.',
      actions    : {
        
        confirm : {
                show : true,
                label: 'Sign In',
                color: 'primary',
            }
        },
        dismissible: false
      };

  constructor(
    private _matDialog: MatDialog
  ) { }

  openSuccess(config: any = {}): MatDialogRef<SuccessAlertComponent>
  {
        // Merge the user config with the default config
        const userConfig = merge({}, this._defaultConfig, config);

        // Open the dialog
        return this._matDialog.open(SuccessAlertComponent, {
            autoFocus   : true,
            disableClose: !userConfig.dismissible,
            data        : userConfig,
            width : '500px',
        });
  }

  openFailed(config: any = {}): MatDialogRef<FailureAlertComponent>
  {
        // Merge the user config with the default config
        const userConfig = merge({}, this._failedDefaultConfig, config);

        // Open the dialog
        return this._matDialog.open(FailureAlertComponent, {
            autoFocus   : true,
            disableClose: !userConfig.dismissible,
            data        : userConfig,
            width : '500px',
        });
  }

  openSessionTimeout(config: any = {}): MatDialogRef<SessionExpiredAlertComponent>
  {
        // Merge the user config with the default config
        const userConfig = merge({}, this._sessionExpiredDefaultConfig, config);

        // Open the dialog
        return this._matDialog.open(SessionExpiredAlertComponent, {
            autoFocus   : true,
            disableClose: !userConfig.dismissible,
            data        : userConfig,
            width : '500px',
        });
  }

}
