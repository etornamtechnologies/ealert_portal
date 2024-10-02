import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-transaction-report',
  templateUrl: './transaction-report.component.html',
  styleUrls: ['./transaction-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class TransactionReportComponent implements OnInit {

  transactionFilter: FormGroup;
  displayedColumns: string[] = ['trn_ref_no','source_account','destination_account','currency','amount','transaction_date','status','narration'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = false;
  isResultEmpty:boolean = false;
  transactions: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;
  
  constructor(
    private utilityApi: UtilityService,
    private renderer: Renderer2,
    private _formBuilder: FormBuilder
  ) {
      this.transactionFilter = this._formBuilder.group({
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

  getTransactionResult(): void 
  {
    if(this.transactionFilter.valid) {
      this.isLoading = true;
      this.renderer.addClass(this.tableDivView.nativeElement,'hidden');
      const transactionParam = {
        fromdate : this.utilityApi.transformDate(this.transactionFilter.value.StartDate._d),
        todate   : this.utilityApi.transformDate(this.transactionFilter.value.EndDate._d)
      };
      this.isResultEmpty = false;
      this.utilityApi.getTransactionByDate(transactionParam).subscribe(response => {
        if (response.errCode === 0) {
          this.transactions = response.data.transactions;
          this.dataSource = new MatTableDataSource(this.transactions);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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

}
