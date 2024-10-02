import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-customer-complaints',
  templateUrl: './customer-complaints.component.html',
  styleUrls: ['./customer-complaints.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class CustomerComplaintsComponent implements OnInit {

  displayedColumns: string[] = ['complaint_date','type','phone','subject','message','user_id','ref_no','actions'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  compaints: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;

  constructor(
    private utilityApi: UtilityService,
    private splashScreen: FuseSplashScreenService,
    private renderer: Renderer2,
    private confirmationDialog: FuseConfirmationService
  ) {}

  ngOnInit(): void 
  {
    this.utilityApi.getCustomersComplaints().subscribe(response =>{
      if (response.errCode === 0) {
        this.compaints = response.data.complaints;
        this.dataSource = new MatTableDataSource(this.compaints);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;  
        if (this.compaints.length === 0) {
          this.isResultEmpty = true;
        }
      }else {
        this.utilityApi.displayError('Unable to fetch customers complaints');
      }
      this.isLoading = false;
      this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
    },()=>{
      this.isLoading = false;
      this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
      this.utilityApi.displayError();
    });
  }
  getComplaints() : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getCustomersComplaints()
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

  markAsResolved(refNumber: String): void 
  {
    const dialogRef = this.confirmationDialog.open({
      "title": "Resolve Complaint",
      "message": `Mark Issue with Reference Number ${refNumber} as resolved?`,
      "icon": {
        "show": true,
        "name": "heroicons_outline:exclamation",
        "color": "info"
      },
      "actions": {
        "confirm": {
          "show": true,
          "label": "Yes",
          "color": "accent"
        },
        "cancel": {
          "show": true,
          "label": "No"
        }
      },
      "dismissible": true
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.splashScreen.show();
      this.utilityApi.markComplaintAsResolved(refNumber).subscribe(response =>{
        this.splashScreen.hide();
        if (response.errCode === 0) {
          this.utilityApi.displaySuccess('Customer complaint resolved successfully');
        }else {
          this.utilityApi.displayFailed(response.errMsg);
        }
      },()=>{
        this.splashScreen.hide();
        this.utilityApi.displayError();
      });
      }
  });
  }

}
