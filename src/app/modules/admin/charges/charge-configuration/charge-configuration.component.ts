import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'app/shared/services/utility.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-charge-configuration',
  templateUrl: './charge-configuration.component.html',
  styleUrls: ['./charge-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ChargeConfigurationComponent implements OnInit {
  
    ChargeConfigForm: FormGroup;
    role:string;
    branches:any[];
    username: string;
    broadcastNow :boolean = false;
    
    filteredBranches: any[] = [];
    customerListFileData: any;

    chargeConfigData: any[]
    autoRun :boolean = false;
    chargeAmount: any;

    constructor(
        private utilityApi: UtilityService, 
        private _formBuilder: FormBuilder,
        private splashScreen: FuseSplashScreenService,
        private confirmationDialog: FuseConfirmationService,
        private authService: AuthService,
        private _matDialog: MatDialog
      ) { 
        this.ChargeConfigForm = this._formBuilder.group({
            AutoRun      : ['',Validators.required],
            ChargeAmount : ['', [
                Validators.required,
                Validators.pattern(/^\d*\.?\d*$/)
              ]],
            
        });
        this.role = this.authService.getLoggedInUserDetails().roleId;
        this.username = this.authService.getLoggedInUserDetails().username;
      }
  
  
    ngOnInit(): void 
    {  
      //getCharge Config
      this.splashScreen.show();
        this.utilityApi.getChargeConfig().subscribe(
        (response) => {
            if (response.code === 200) {
                this.ChargeConfigForm.patchValue({
                    ChargeAmount: response.data.chargeAmount,
                    AutoRun: response.data.autoRun
                  });
            } else {
                this.utilityApi.displayError('Unable to fetch charge');
            }
            this.splashScreen.hide();
        },
        () => {
            this.splashScreen.hide();
            this.utilityApi.displayError('Unable to fetch charge');
        }
    );
}
      
    chargeSetup(){
    let autoRun = this.ChargeConfigForm.get('AutoRun').value;
    let chargeAmount = this.ChargeConfigForm.value.ChargeAmount
    const dialogRef = this.confirmationDialog.open({
      "title": "Charge Setup",
      "message": `Are you sure you want to update charge amont t </br><span class="text-lg font-semibold">${chargeAmount}</span>  ?`,
      "icon": {
        "show": true,
        "name": "heroicons_outline:trash",
        "color": "warn"
      },
      "actions": {
        "confirm": {
          "show": true,
          "label": "Submit",
          "color": "primary"
        },
        "cancel": {
          "show": true,
          "label": "Cancel"
        }
      },
      "dismissible": true
    });
      dialogRef.afterClosed().subscribe((result) => {
          if (result === 'confirmed') {
            this.splashScreen.show();
            const chargeData= {
              autoRun : autoRun,
              chargeAmount  : chargeAmount
          };
          this.utilityApi.setChargeConfig(JSON.stringify(chargeData)).subscribe(response =>{
            this.splashScreen.hide();
            if (response.code === 200) {
              this.utilityApi.displaySuccess(response.message);
            }else {
              this.utilityApi.displayFailed('Charge setup failed, try again later.\n'+response.message);
            }
          },()=>{
            this.splashScreen.hide();
            this.utilityApi.displayFailed('Charge setup failed, server error.');
          });
          }
      }); 
    }
    
  }
 
  


