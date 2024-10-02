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
  selector: 'app-authorize-user',
  templateUrl: './authorize-user.component.html',
  styleUrls: ['./authorize-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AuthorizeUserComponent implements OnInit {

  displayedColumns: string[] = ['select_all','username','fullname','role','branch','department','status','authStat','maker'];//email' department
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  users: any[] = [];
  userBranch: string;
  username: string;
  selectedRecord: any[] = [];
  master: boolean = false;

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
    this.getUsers('D',this.userBranch).then(response => {
      if (response.code === 200) {
        this.users = response.data;
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
          this.utilityApi.displayError('Unable to fetch users');
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
    });
  }

  getUsers(status : string, branch : string) : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getUnAuthUsers()
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

  isSameMaker(userdata: any): boolean {
    // console.log('customer', customerData)
    return userdata?.makerId === this.username
  }

  isMakerAuthorized(userData: any): boolean {
    return userData?.makerId !== this.username
  }

  checkUncheckAll(): void {
    this.selectedRecord = [];
    if (this.master) {
        this.master = true;
        this.dataSource.filteredData
        .filter(it => this.isMakerAuthorized(it))
        .forEach((item) => {
            this.selectedRecord.push(item.username);
        });
    } else {
        this.master = false;
     }
    this.dataSource.filteredData
    .filter(it => this.isMakerAuthorized(it))
    .forEach((child) => {
        child.selected = this.master;
    });
  }
  
  userIsClicked(acountDetails: any): void {
    if (acountDetails.selected) {
        this.selectedRecord.push(acountDetails.username);
        if (this.selectedRecord.length === this.users.length) {
            this.master = true;
        }
    } else {
        this.master = false;
        var selectedIndex = this.selectedRecord.indexOf(
          acountDetails.username
        );
        this.selectedRecord.splice(selectedIndex, 1);
    }

  } 

  authorizeUser(userDetails : any) : void 
  {
    console.log('yeah details...............')
      const dialogRef = this.confirmationDialog.open({
        "title": "Authorize User",
        "message": `Are you sure you want to authorise these users?`,
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
              const payloadObj = {
                userNames: this.selectedRecord,
                action: 'ACCEPT'
              };
              console.log('payload object', payloadObj)
              this.utilityApi.authorizeBankUser(payloadObj).subscribe(response =>{
                this.splashScreen.hide();
                if (response.code === 200) {
                  this.utilityApi.displaySuccess('User was successfully authorized');
                }else {
                  this.utilityApi.displayFailed(response.message + ' User authorization process failed try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('User authorization process failed, server error.');
              });
            }
        });
   }

   rejectUser(userDetails : any) : void 
  {
    console.log('yeah details...............')
      const dialogRef = this.confirmationDialog.open({
        "title": "Authorize User",
        "message": `Are you sure you want to reject these users?`,
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
              const payloadObj = {
                userNames: this.selectedRecord,
                action: 'REJECT'
              };
              console.log('payload object', payloadObj)
              this.utilityApi.authorizeBankUser(payloadObj).subscribe(response =>{
                this.splashScreen.hide();
                if (response.code === 200) {
                  this.utilityApi.displaySuccess('User changes were successfully rejected');
                }else {
                  this.utilityApi.displayFailed(response.message + ' User authorization process failed try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('User authorization process failed, server error.');
              });
            }
        });
   }

}
