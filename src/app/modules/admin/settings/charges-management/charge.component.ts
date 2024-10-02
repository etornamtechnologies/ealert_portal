import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilityService } from 'app/shared/services/utility.service';
import { ViewCustomerDetailsComponent } from '../../customer/view-customer-details/view-customer-details.component';

@Component({
  selector: 'app-charge-managment',
  templateUrl: './charge.component.html',
  styleUrls: ['./charge.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ChargeManagementComponent implements OnInit {

  chargemanagment: FormGroup;
  displayedColumns: string[] = ['customername','account_no','chargetype','chargestatus'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = false;
  isResultEmpty:boolean = false;
  customers: any[] = [];
  selectedRecord: any[] = [];
  master: boolean = false;
  userBranch: string;
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
      ChargeOption       : ['',Validators.required],
      chargeValue        : ['',Validators.required],
      // OldPassword     : ['',Validators.required],
      // NewPassword     : ['',[Validators.required,Validators.minLength(6)]],
      // ConfirmPassword : ['',Validators.required]
    });
    }

  ngOnInit(): void 
  {
    this.isLoading = true;
    this.getUnauthorizedCustomers("FLAT").then(response => {
      console.log(response);
      if (response.code === 200) {
        this.chargemanagment.value.chargeValue=response.data
      }else {
        this.isLoading = false;
        this.utilityApi.displayFailed(response.errMsg);
      }  
    },()=> {
          this.isLoading = false;
          this.utilityApi.displayError('Unable to fetch charges record');
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
    });
  }
  getChargeamount(chargedesc:any)
  {
    this.isLoading = false;
    this.utilityApi.getCharges(chargedesc).subscribe(response => {
      if (response.code === 200) {
        this.isLoading = false;
        this.chargemanagment.value.chargeValue=response.data
      }else {
        this.isLoading = false;
        this.utilityApi.displayFailed(response.errMsg+" Charge Fetch Failed");
      } 

    },()=> {
          this.isLoading = false;
          this.utilityApi.displayError('Unable to fetch charges record');
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

  changeUserPassword(): void 
  {
    if (this.chargemanagment.valid) 
    {
      if (this.chargemanagment.value.NewPassword === this.chargemanagment.value.ConfirmPassword) 
      {
        if(this.chargemanagment.value.NewPassword !== this.chargemanagment.value.OldPassword) 
        {

              const dialogRef = this.confirmationDialog.open({
                "title": "Confirm Password Change",
                "message": `<span class="text-lg font-normal">Proceed with password change process?</span>`,
                "icon": {
                  "show": true,
                  "name": "heroicons_outline:lock-closed",
                  "color": "info"
                },
                "actions": {
                  "confirm": {
                    "show": true,
                    "label": "Continue",
                    "color": "primary"
                  },
                  "cancel": {
                    "show": true,
                    "label": "Cancel"
                  }
                },
                "dismissible": true
              });
              console.log(this.authService.getLoggedInUserDetails().id);
        
              dialogRef.afterClosed().subscribe((result) => {
                if (result === 'confirmed')
                {
                  this.splashScreen.show();
                  const userId = this.authService.getLoggedInUserDetails().id;
                  const passwordObj = {
                    oldPassword     : this.chargemanagment.value.OldPassword,
                    newPassword     : this.chargemanagment.value.NewPassword, 
                    userId          : userId
                  };
                  this.utilityApi.changeAdminPassword(JSON.stringify(passwordObj)).subscribe(response => {
                    this.splashScreen.hide();
                    if (response.errCode === 0) {
                      this.utilityApi.displaySuccessRedirect('Password change was successful','/auth/sign-in');
                    }else {
                      this.utilityApi.displayFailed(response.errMsg);
                    }
                  },()=>{
                    this.splashScreen.hide();
                    this.utilityApi.displayFailed('Server error, unable to change password.');
                  });
                }
                
            });
        }else {
          this.snackBar.open('Old password and new password are the same.','OK',{duration: 4000});
        }   
      }else {
        this.snackBar.open('Password mistmach!','OK',{duration: 3000});
      }
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



}
