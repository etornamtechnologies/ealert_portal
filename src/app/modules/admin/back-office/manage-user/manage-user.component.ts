import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { AppStore } from 'app/shared/localstorage-helper';
import { UtilityService } from 'app/shared/services/utility.service';
import { isNull } from 'lodash';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ManageUserComponent implements OnInit {

  displayedColumns: string[] = ['fullname','role','branch','department','username','auth_stat','actions'];//email'
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  users: any[] = [];
  userBranch: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;
  
  constructor(
    private utilityApi: UtilityService,
    private splashScreen: FuseSplashScreenService,
    private renderer: Renderer2,
    private route: Router, 
    private confirmationDialog: FuseConfirmationService,
    private authService: AuthService
  ) {
      this.userBranch = this.authService.getLoggedInUserDetails().branch;
    }

  ngOnInit(): void
  {
    this.getUsers(this.userBranch).then(response => {
      if (response.code === 200) {
        console.log(response.data);
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

  getUsers(branch : string) : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getAllAppUsers(branch)
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

  editUser(userDetails : any) : void 
  {
    AppStore.set('editUserData',JSON.stringify(userDetails));
    this.route.navigate(['/ealert/user-management/users','edit',btoa(userDetails.userName)]);
  }

  trancribe_active(status:any)
  {
    if (status === 'A')
    {
      return 'Activated'
    }
    else if(isNull(status))
    {
      return 'Unauthorised'
    }
    else{
      return 'Deactivated'
    }

  }

  userdeativate(userDetails : any) : void 
  {
      const dialogRef = this.confirmationDialog.open({
        "title": "User Deactivate",
        "message": `Are you sure you want to deactivate the user  </br><span class="text-lg font-semibold">${userDetails.fullname}</span>?`,
        "icon": {
          "show": true,
          "name": "heroicons_outline:logout",
          "color": "success"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "submit",
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
              this.utilityApi.userDeactivate(userDetails.username).subscribe(response =>{
                this.splashScreen.hide();
                if (response.code === 200) {
                  this.utilityApi.displaySuccess('User deactivated successfully');
                }else {
                  this.utilityApi.displayFailed(response.message + ' User deactivation not successfully, try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('User deactivation not successfully, server error.');
              });
            }
        });
  }

  userativate(userDetails : any) : void 
  {
      const dialogRef = this.confirmationDialog.open({
        "title": "User Activate",
        "message": `Are you sure you want to activtae the user </br><span class="text-lg font-semibold">${userDetails.fullname} </span>?`,
        "icon": {
          "show": true,
          "name": "heroicons_outline:logout",
          "color": "success"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "submit",
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
              this.utilityApi.userActivate(userDetails.username).subscribe(response =>{
                this.splashScreen.hide();
                if (response.code === 200) {
                  this.utilityApi.displaySuccess('User deactivated successfully');
                }else {
                  this.utilityApi.displayFailed(response.message + ' User activation not successfully, try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('User activation not successfully, server error.');
              });
            }
        });
  }


  exportToExcel(): void {
    
    const workSheet = XLSX.utils.json_to_sheet(
        this.dataSource.filteredData
    );
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
    XLSX.writeFile(workBook, "filename.xlsx");
}



}
