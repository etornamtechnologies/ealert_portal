import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-authorize-broadcast-email',
  templateUrl: './authorize-broadcast-email.component.html',
  styleUrls: ['./authorize-broadcast-email.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AuthorizeBroadcastEmailComponent implements OnInit {

  displayedColumns: string[] = ['message','run_date','created_by','time_stamp','actions'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  users: any[] = [];
  userBranch: string;
  username: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;

  constructor(
    private utilityApi: UtilityService,
    private splashScreen: FuseSplashScreenService,
    private renderer: Renderer2,
    private confirmationDialog: FuseConfirmationService,
    private authService: AuthService
  ) {
      this.username = this.authService.getLoggedInUserDetails().username;
      this.userBranch = this.authService.getLoggedInUserDetails().branch;
    }

  ngOnInit(): void 
  {
    this.getUnauthEmailBroadcast().then(response => {
      if (response.code === 200) {
        // this.users = response.data;
        let broadcastdetails = response.data
        console.log(response.data)
        this.dataSource = new MatTableDataSource(broadcastdetails);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (broadcastdetails.length === 0) {
          this.isResultEmpty = true;
        }
      }else {
        this.utilityApi.displayError(response.errMsg);
      } 
      this.isLoading = false;
      this.renderer.removeClass(this.tableDivView.nativeElement,'hidden'); 
    },()=> {
          this.isLoading = false;
          this.utilityApi.displayError('Unable to fetch adb broadcast details');
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
    });
  }

  getUsers(status : string, branch : string) : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getAdbUsersByAuthStat(status,branch)
          .subscribe((response: any) => {
            resolve(response);
          },()=> {
            reject();
          });
    });
  }

  getUnauthEmailBroadcast() : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getUnauthorizedEmailBroadcasts()
          .subscribe((response: any) => {
            resolve(response);
          },()=> {
            reject();
          });
    });
  }

  authorizebroadcast(broadcast : any) : void 
  {
      const dialogRef = this.confirmationDialog.open({
        "title": "Authorize SMS Broadcast",
        "message": `Are you sure you want to authorise this broadcast from <span class="text-lg font-semibold">${broadcast.maintainedBy}?</span>`,
        "icon": {
          "show": true,
          "name": "mat_outline:library_add_check",
          "color": "info"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "Authorize",
            "color": "accent"
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
              // const statusObj = {
              //     id  : broadcast.guid
              // };
              this.utilityApi.authoriseEmailBroadcast(broadcast.guid).subscribe(response =>{
                this.splashScreen.hide();
                if (response.code === 200) {
                  this.utilityApi.displaySuccess('Broadcast was successfully authorized');
                }else {
                  this.utilityApi.displayFailed('Broadcast authorization process failed try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('Broadcast authorization process failed, server error.');
              });
            }
        });
   }


  applyFilter(filterValue: string): void
  {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  authorizeUser(userDetails : any) : void 
  {
      const dialogRef = this.confirmationDialog.open({
        "title": "Authorize Adb User",
        "message": `Are you sure you want to authorise this user </br><span class="text-lg font-semibold">${userDetails.fname} ${userDetails.lname}?</span>`,
        "icon": {
          "show": true,
          "name": "mat_outline:library_add_check",
          "color": "info"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "Authorize",
            "color": "accent"
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
              const statusObj = {
                  admin  : this.username,
                  userId : userDetails.id,
                  status : 'A'
              };
              this.utilityApi.authorizeUser(JSON.stringify(statusObj)).subscribe(response =>{
                this.splashScreen.hide();
                if (response.errCode === 0) {
                  this.utilityApi.displaySuccess('User was successfully authorized');
                }else {
                  this.utilityApi.displayFailed('User authorization process failed try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('User authorization process failed, server error.');
              });
            }
        });
   }

}
