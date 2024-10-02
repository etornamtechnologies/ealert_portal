import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-view-collection-user',
  templateUrl: './view-collection-user.component.html',
  styleUrls: ['./view-collection-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ViewCollectionUserComponent implements OnInit {

  user: any;
  loggedInUsername:string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private utilityApi: UtilityService,
    private confirmationDialog: FuseConfirmationService,
    private splashScreen: FuseSplashScreenService,
    private authService: AuthService,
    public matDialogRef: MatDialogRef<ViewCollectionUserComponent>
    ) { 
    this.user = this.data.collectionUser;
    this.loggedInUsername = this.authService.getLoggedInUserDetails().username;
  }

  ngOnInit(): void {}



  blockUser(userDetails : any) : void 
  {
      const dialogRef = this.confirmationDialog.open({
        "title": "Block User",
        "message": `Are you sure you want to block this collection user </br><span class="text-lg font-semibold">${userDetails.firstname} ${userDetails.lastname}?</span>`,
        "icon": {
          "show": true,
          "name": "heroicons_outline:exclamation",
          "color": "info"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "Block",
            "color": "warn"
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
              this.matDialogRef.close();
              this.splashScreen.show();
              const user = {
                firstname     : userDetails.firstname,
                lastname      : userDetails.lastname,
                id            : userDetails.id,
                statusBy      : this.loggedInUsername,
                status        : 'D'
            };
            this.utilityApi.updateCollectionUserStatus(JSON.stringify(user)).subscribe(response =>{
              this.splashScreen.hide();
              if (response.errCode === 0) {
                this.utilityApi.displaySuccess('User blocked successfully');
              }else {
                this.utilityApi.displayFailed('User block process failed try again later.');
              }
            },()=>{
              this.splashScreen.hide();
              this.utilityApi.displayFailed('User block process failed, server error.');
            });
            }
        });
  }

  activateUser(userDetails : any) : void 
  {
      const dialogRef = this.confirmationDialog.open({
        "title": "Activate User",
        "message": `Are you sure you want to activate this collection user </br><span class="text-lg font-semibold">${userDetails.firstname} ${userDetails.lastname}?</span>`,
        "icon": {
          "show": true,
          "name": "mat_outline:fact_check",
          "color": "success"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "Activate",
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
              this.matDialogRef.close();
              this.splashScreen.show();
              const user = {
                  firstname     : userDetails.firstname,
                  lastname      : userDetails.lastname,
                  id            : userDetails.id,
                  statusBy      : this.loggedInUsername,
                  status        : 'A'
              };
              this.utilityApi.updateCollectionUserStatus(JSON.stringify(user)).subscribe(response =>{
                this.splashScreen.hide();
                if (response.errCode === 0) {
                  this.utilityApi.displaySuccess('User activated successfully');
                }else {
                  this.utilityApi.displayFailed('User activation process failed try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('User activation process failed, server error.');
              });
            }
        });
  }

}
