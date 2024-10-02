import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { ViewCustomerDetailsComponent } from '../../customer/view-customer-details/view-customer-details.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialogRef } from '@angular/material/dialog';
import { UtilityService } from 'app/shared/services/utility.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'app-process-charge',
  templateUrl: './process-charge.component.html',
  styleUrls: ['./process-charge.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ProcessChargeComponent implements OnInit {

  chargemanagment: FormGroup;
  displayedColumns: string[] = ['customername','account_no','chargetype','chargestatus'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = false;
  isResultEmpty:boolean = false;
  customers: any[] = [];
  selectedRecord: any[] = [];
  master: boolean = false;
  userBranch: string;
  months: any[];
  years: any[];
  username: string;
  dialogRef: MatDialogRef<ViewCustomerDetailsComponent>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;

  constructor(
    private utilityApi: UtilityService, 
    private _formBuilder: FormBuilder,
    private splashScreen: FuseSplashScreenService,
    private confirmationDialog: FuseConfirmationService,
    public snackBar: MatSnackBar,
    private authService: AuthService,
    private renderer: Renderer2,
  ) {
    this.chargemanagment = this._formBuilder.group({
      Month  : ['',Validators.required],
      Year    : ['',Validators.required],
    });
    }

  ngOnInit(): void {
    this.splashScreen.show();
    this.utilityApi.getMonths().subscribe(
        (response) => {
            if (response.code === 200) {
                this.months = response.data;
            } else {
                this.utilityApi.displayError('Unable to fetch months');
            }
            this.splashScreen.hide();
        },
        () => {
            this.splashScreen.hide();
            this.utilityApi.displayError('Unable to fetch months');
        }
    );

    this.splashScreen.show();
    this.utilityApi.getYears().subscribe(
        (response) => {
            if (response.code === 200) {
                this.years = response.data;
            } else {
                this.utilityApi.displayError('Unable to fetch years');
            }
            this.splashScreen.hide();
        },
        () => {
            this.splashScreen.hide();
            this.utilityApi.displayError('Unable to fetch years');
        }
    );
  }

  processCharge()
  {
    let month = this.chargemanagment.value.Month
    let year = this.chargemanagment.value.Year
    const dialogRef = this.confirmationDialog.open({
      "title": "Process Charge",
      "message": `Are you sure you want to process charge for </br><span class="text-lg font-semibold">${month}  ${year}</span>  ?`,
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
              month : month,
              year  : year
          };
          this.utilityApi.processCharges(JSON.stringify(chargeData)).subscribe(response =>{
            this.splashScreen.hide();
            if (response.code === 200) {
              this.utilityApi.displaySuccess(response.message);
            }else {
              this.utilityApi.displayFailed('Charge processing failed, try again later.\n'+response.message);
            }
          },()=>{
            this.splashScreen.hide();
            this.utilityApi.displayFailed('Charge Processing  failed, server error.');
          });
          }
      }); 
  }

  applyChargeChange(){
    if (this.chargemanagment.valid)
    {
      const dialogRef = this.confirmationDialog.open({
        "title": "Confirm Charge change",
        "message": `<span class="text-lg font-normal">Kindly confirm request to change charge ?</span><br>from<br>`,
        "icon": {
          "show": true,
          "name": "heroicons_outline:lock-closed",
          "color": "info"
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
        if (result === 'confirmed')
        {
          this.splashScreen.show();
          const userId = this.authService.getLoggedInUserDetails().id;
          const chargeObj = {
            chargeDesc     : this.chargemanagment.value.ChargeOption,
            chargeAmount     : this.chargemanagment.value.chargeValue, 
            userId          : userId
          };
          this.utilityApi.changeAdminPassword(JSON.stringify(chargeObj)).subscribe(response => {
            this.splashScreen.hide();
            if (response.errCode === 0) {
              this.utilityApi.displaySuccessRedirect('Charge changes applied successful','/auth/sign-in');
            }else {
              this.utilityApi.displayFailed(response.errMsg+ 'Charge chances failed');
            }
          },()=>{
            this.splashScreen.hide();
            this.utilityApi.displayFailed('Server error, unable to change charge.');
          });
        }
        
    });
     
    }  
  }

  getUnauthorizedCustomers(chargeType:any) : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getAppCharge(chargeType)
          .subscribe((response: any) => {
            resolve(response);
          },()=> {
            reject();
          });
    });
  
  }
  
//Original
}
