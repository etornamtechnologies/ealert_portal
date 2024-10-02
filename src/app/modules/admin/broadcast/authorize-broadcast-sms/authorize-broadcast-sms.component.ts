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
  selector: 'app-authorize-broadcast-sms',
  templateUrl: './authorize-broadcast-sms.component.html',
  styleUrls: ['./authorize-broadcast-sms.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AuthorizeBroadcastSmsComponent implements OnInit {

  displayedColumns: string[] = ['message','run_date','created_by','gender','religion','actions'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  broadcasts: any[] = [];
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
    this.getUnauthSmsBroadcast().then(response => {
      if (response.code === 200) {
        this.broadcasts = response.data;
        this.dataSource = new MatTableDataSource(this.broadcasts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.broadcasts.length === 0) {
          this.isResultEmpty = true;
        }
      }else {
        this.utilityApi.displayError(response.errMsg);
      } 
      this.isLoading = false;
      this.renderer.removeClass(this.tableDivView.nativeElement,'hidden'); 
    },()=> {
          this.isLoading = false;
          this.utilityApi.displayError('Unable to fetch broadcasts');
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
    });
  }

  getUnauthSmsBroadcast() : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getUnauthorizedSMSBroadcasts()
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
              const statusObj = {
                  id  : broadcast.guid
              };
              this.utilityApi.authoriseSMSBroadcast(JSON.stringify(statusObj)).subscribe(response =>{
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

}
