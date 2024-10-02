import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AppStore } from 'app/shared/localstorage-helper';
import { UtilityService } from 'app/shared/services/utility.service';
import { ViewCollectionUserComponent } from '../view-collection-user/view-collection-user.component';

@Component({
  selector: 'app-collection-users',
  templateUrl: './collection-users.component.html',
  styleUrls: ['./collection-users.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class CollectionUsersComponent implements OnInit {

  displayedColumns: string[] = ['username','fullname','email','phone_number','collection_type','status','actions'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  collUsers: any[] = [];
  dialogRef: MatDialogRef<ViewCollectionUserComponent>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;

  constructor(
    private utilityApi: UtilityService,
    private renderer: Renderer2,
    private route: Router, 
    private confirmationDialog: FuseConfirmationService,
    private _matDialog: MatDialog,
    private splashScreen: FuseSplashScreenService
  ) { }

  ngOnInit(): void 
  {
    this.getCollectionUsers().then(response => {
      if (response.errCode === 0) {
        this.collUsers = response.data.users;
        this.dataSource = new MatTableDataSource(this.collUsers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.collUsers.length === 0) {
          this.isResultEmpty = true;
        }
      }else {
        this.utilityApi.displayFailed(response.errMsg);
      }
      this.isLoading = false;
      this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');  
    },()=> {
          this.isLoading = false;
          this.utilityApi.displayError('Unable to fetch collection users');
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
    });
  }

  getCollectionUsers() : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getCollectionUsers()
          .subscribe((response: any) => {
            resolve(response);
          },()=> {
            reject();
          });
    });
  }

  applyFilter(filterValue: string): void
  {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editCollectionUser(userDetails : any) : void 
  {
    AppStore.set('editCollectionUserData',JSON.stringify(userDetails));
    this.route.navigate(['/xmobileadmin/system-activities/collection-users','edit',btoa(userDetails.id)]);
  }

  viewUserDetails(collectionUser : any) : void 
  {
    this.dialogRef = this._matDialog.open(ViewCollectionUserComponent,{
      data: {
        collectionUser
       },
      width : '500px',
      disableClose: false
    });
  }

  resetUserPassword(userDetails : any) : void 
  {
      const dialogRef = this.confirmationDialog.open({
        "title": "Reset User Password",
        "message": `Are you sure you want to reset password for </br><span class="text-lg font-semibold">${userDetails.firstname} ${userDetails.lastname}</span>?`,
        "icon": {
          "show": true,
          "name": "heroicons_outline:logout",
          "color": "success"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "Reset Password",
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
              this.utilityApi.resetCollectionUserPassword(JSON.stringify(userDetails)).subscribe(response =>{
                this.splashScreen.hide();
                if (response.errCode === 0) {
                  this.utilityApi.displaySuccess('User password was reset successfully');
                }else {
                  this.utilityApi.displayFailed('User password could not be reset, try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('User password could not be reset, server error.');
              });
            }
        });
  }

}
