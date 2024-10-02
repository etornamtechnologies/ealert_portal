import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-express-pay-monthly-report',
  templateUrl: './express-pay-monthly-report.component.html',
  styleUrls: ['./express-pay-monthly-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ExpressPayMonthlyReportComponent implements OnInit {

  epTransFilter: FormGroup;
  displayedColumns: string[] = ['from_account','destination','amount','service_type','timestamp','reference'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = false;
  isResultEmpty:boolean = false;
  transactions: any[] = [];
  totalAmount: number = 0;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;

  constructor(
    private utilityApi: UtilityService,
    private splashScreen: FuseSplashScreenService,
    private renderer: Renderer2,
    private _formBuilder: FormBuilder
  ) {
      this.epTransFilter = this._formBuilder.group({
        StartDate  : ['',Validators.required],
        EndDate    : ['',Validators.required]
      });
    }

  ngOnInit(): void 
  {
    this.dataSource = new MatTableDataSource(this.transactions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string): void
  {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getEPTransactionResult(): void 
  {
    if(this.epTransFilter.valid) {
      this.isLoading = true;
      this.renderer.addClass(this.tableDivView.nativeElement,'hidden');
      const transactionParam = {
        fromdate : this.utilityApi.transformDate(this.epTransFilter.value.StartDate._d),
        todate   : this.utilityApi.transformDate(this.epTransFilter.value.EndDate._d)
      };
      this.isResultEmpty = false;
      this.utilityApi.getExpressPayTransactions(transactionParam).subscribe(response => {
        if (response.errCode === 0) {
          this.transactions = response.data.transactions;
          this.dataSource = new MatTableDataSource(this.transactions);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if(this.transactions.length > 0){
            this.totalAmount = this.transactions.reduce((previousValue,currentValue)=> previousValue + parseInt(currentValue.amount),0);
          }
          if (this.transactions.length === 0) {
            this.isResultEmpty = true;
          }
        }else {
          this.utilityApi.displayFailed(response.errMsg);
        }
        this.isLoading = false;
        this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
      },()=>{
        this.isLoading = false;
        this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
        this.utilityApi.displayError();
      });
    }
  }

  exportExpressPayTransactions(): void 
  {
    if(this.epTransFilter.value.StartDate === '') 
    {
      this.utilityApi.displayError('Please select start date');
      return;
    }
    if(this.epTransFilter.value.EndDate === '') 
    {
      this.utilityApi.displayError('Please select end date');
      return;
    }

    this.splashScreen.show();
    const transactionParam = {
      fromdate : this.utilityApi.transformDate(this.epTransFilter.value.StartDate._d),
      todate   : this.utilityApi.transformDate(this.epTransFilter.value.EndDate._d)
    };
    this.utilityApi.exportExpressPayTransactions(transactionParam).subscribe(response => {
      if (response !== null) {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        downloadLink.setAttribute('download', 'expresspay-monthly-commission-report.xlsx');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.parentNode.removeChild(downloadLink);
      }else {
        this.utilityApi.displayFailed('Error occurred, unable to export transaction data.');
      }
      this.splashScreen.hide();
    },()=>{
      this.splashScreen.hide();
      this.utilityApi.displayFailed('Error occurred, unable to export transaction data.');
    });
  }

}
