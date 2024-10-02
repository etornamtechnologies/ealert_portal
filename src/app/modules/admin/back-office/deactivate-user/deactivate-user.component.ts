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
  selector: 'app-deactivate-user',
  templateUrl: './deactivate-user.component.html',
  styleUrls: ['./deactivate-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class DeactivateUserComponent implements OnInit {

  displayedColumns: string[] = ['firstname','email','role','branch','phone','locked','status','auth_stat','actions'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  users: any[] = [];
  username: string;
  userBranch: string;

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
    this.getUsers('A',this.userBranch).then(response => {
      if (response.errCode === 0) {
        this.users = response.data.users;
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.users.length === 0) {
          this.isResultEmpty = true;
        }
      }else {
        this.utilityApi.displayError(response.errMsg);
      } 
      this.isLoading = false;
      this.renderer.removeClass(this.tableDivView.nativeElement,'hidden'); 
    },()=> {
          this.isLoading = false;
          this.utilityApi.displayError('Unable to fetch adb users');
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
    });
  }

  getUsers(status : string, branch: string) : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getAdbUserByStatus(status,branch)
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

  blockUser(user: any): void 
  {
    console.log(user);
    const dialogRef = this.confirmationDialog.open({
      "title": "Disable User",
      "message": `Are you sure you want to block this user </br><span class="text-lg font-semibold">${user.fname} ${user.lname}?</span>`,
      "icon": {
        "show": true,
        "name": "heroicons_outline:exclamation",
        "color": "info"
      },
      "actions": {
        "confirm": {
          "show": true,
          "label": "Disable",
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
              this.splashScreen.show();
              const statusObj = {
                  admin  : this.username,
                  userId : user.id,
                  status : 'D'
              };
              this.utilityApi.updateAdbUserStatus(JSON.stringify(statusObj)).subscribe(response =>{
                this.splashScreen.hide();
                if (response.errCode === 0) {
                  this.utilityApi.displaySuccess(`${user.fname} disabled successfully`);
                }else {
                  this.utilityApi.displayFailed('User disable process failed try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('User disable process failed, server error.');
              });
            }
        });
  }

}
