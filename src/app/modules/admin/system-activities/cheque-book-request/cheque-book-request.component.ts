import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-cheque-book-request',
  templateUrl: './cheque-book-request.component.html',
  styleUrls: ['./cheque-book-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ChequeBookRequestComponent implements OnInit {

  displayedColumns: string[] = ['account_number','cheque_book_type','quantity','pickup_branch','status','date_created'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  chequeRequests: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;

  constructor(
    private utilityApi: UtilityService,
    private renderer: Renderer2,
    private confirmationDialog: FuseConfirmationService,
    private splashScreen: FuseSplashScreenService
  ) { }

  ngOnInit(): void 
  {
    this.getChequebookRequests().then(response => {
      if (response.errCode === 0) {
        this.chequeRequests = response.data.requests;
        this.dataSource = new MatTableDataSource(this.chequeRequests);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.chequeRequests.length === 0) {
          this.isResultEmpty = true;
        }
      }else {
        this.utilityApi.displayFailed(response.errMsg);
      }
      this.isLoading = false;
      this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');  
    },()=> {
          this.isLoading = false;
          this.utilityApi.displayError('Unable to fetch cheque book requests');
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
    });
  }

  getChequebookRequests() : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getChequeBookRequests()
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

  resolveChequebookRequest(chequeData:any) 
  {
    
    const dialogRef = this.confirmationDialog.open({
      "title": "Resolve Chequebook Request",
      "message": `Are you sure this request for account number </br><span class="text-sm font-semibold">(${chequeData.acNo})</span> has been resolved?`,
      "icon": {
        "show": true,
        "name": "mat_outline:fact_check",
        "color": "success"
      },
      "actions": {
        "confirm": {
          "show": true,
          "label": "Yes",
          "color": "primary"
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
            this.utilityApi.updateChequebookRequest(chequeData.ebankingRefNum,chequeData.acNo,'RESOLVED').subscribe(response => {
              this.splashScreen.hide();
              if (response.errCode === 0) {
                this.utilityApi.displaySuccess('Customer Cheque Book Request resolved successfully');
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
