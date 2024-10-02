import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-transaction-exemptions',
  templateUrl: './transaction-exemptions.component.html',
  styleUrls: ['./transaction-exemptions.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class TransactionExemptionsComponent implements OnInit {

  reportFilter: FormGroup;
  displayedColumns: string[] = ['transaction_code','transaction_desc','actions'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  txnCodes: any[] = [];
  deniedTxnCodes: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;

  constructor(
    private utilityApi: UtilityService,
    private splashScreen: FuseSplashScreenService,
    private renderer: Renderer2,
    private _formBuilder: FormBuilder,
    private confirmationDialog: FuseConfirmationService,
  ) { 
      this.reportFilter = this._formBuilder.group({
        TxnCode : ['',Validators.required]
      });
    }

  ngOnInit(): void 
  {
    this.getTransactionCodes().then(response => {
      if (response.code === 200) {
        this.txnCodes = response.data.trnCodes;
        //load drop data


        //load table data
        this.deniedTxnCodes = response.data.deniedTrnCodes;
        this.dataSource = new MatTableDataSource(this.deniedTxnCodes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
        this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
        if (this.deniedTxnCodes.length === 0) {
          this.isResultEmpty = true;
        }
      }else {
        this.isLoading = false;
        this.utilityApi.displayFailed(response.errMsg);
      }  
    },()=> {
          this.isLoading = false;
          this.utilityApi.displayError('Unable to fetch SMS reports');
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
    });
  }

  applyFilter(filterValue: string): void
  {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getSmsTransactions() : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getSMSReports()
          .subscribe((response: any) => {
            resolve(response);
          },()=> {
            reject();
          });
    });
  }

  getTransactionCodes() : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getTransactionCodes()
          .subscribe((response: any) => {
            resolve(response);
          },()=> {
            reject();
          });
    });
  }

  remove(department : any): void 
  {

  }

  addTransactionCode(): void 
  {
      if(this.reportFilter.valid) 
      {
        const tranCodesData = {
          trnCode      : this.reportFilter.value.TxnCode,
          deniedTrnCodes      : []
        };
        const dialogRef = this.confirmationDialog.open({
          "title": "Exempt Transaction Code",
          "message": `Are you sure you want to exempt the transaction code </br><span class="text-lg font-semibold">${tranCodesData.trnCode}?</span>`,
          "icon": {
            "show": true,
            "name": "heroicons_outline:exclamation",
            "color": "info"
          },
          "actions": {
            "confirm": {
              "show": true,
              "label": "ADD",
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
          this.utilityApi.addTransactionCodeExemption(JSON.stringify(tranCodesData)).subscribe(response =>{
            this.splashScreen.hide();
            if (response.code === 200) {
              this.utilityApi.displaySuccess('Transaction code excemption successfully');
            }else {
              this.utilityApi.displayFailed('Transaction code excemption failed try again later.');
            }
          },()=>{
            this.splashScreen.hide();
            this.utilityApi.displayFailed('Transaction code excemption failed, server error.');
          });
        })

        
      }
  }

  removeTransactionCode(TranRec:any): void 
  {
        const dialogRef = this.confirmationDialog.open({
          "title": "Remove Transaction code",
          "message": `Are you sure you want to remove the transaction code </br><span class="Center text-lg font-semibold">${TranRec.trnCode} ?</span>`,
          "icon": {
            "show": true,
            "name": "heroicons_outline:exclamation",
            "color": "info"
          },
          "actions": {
            "confirm": {
              "show": true,
              "label": "Remove",
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
          this.utilityApi.removeTransactionCodeExemption(TranRec.trnCode).subscribe(response =>{
            this.splashScreen.hide();
            if (response.code === 200) {
              this.utilityApi.displaySuccess('Transaction code removed successfully');
            }else {
              this.utilityApi.displayFailed('Transaction code removal failed try again later.');
            }
          },()=>{
            this.splashScreen.hide();
            this.utilityApi.displayFailed('Transaction code removal failed, server error.');
          });
        })
  }


}
