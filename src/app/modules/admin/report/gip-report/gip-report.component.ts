import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-gip-report',
  templateUrl: './gip-report.component.html',
  styleUrls: ['./gip-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class GipReportComponent implements OnInit {

  transactionFilter: FormGroup;
  displayedColumns: string[] = ['source_account','destination_account','reference','amount','transaction_date','narration','status'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
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
    this.getGipTransactions().then(response => {
      if (response.errCode === 0) {
        this.transactions = response.data.report;
        this.dataSource = new MatTableDataSource(this.transactions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
        this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
        if (this.transactions.length === 0) {
          this.isResultEmpty = true;
        }
      }else {
        this.isLoading = false;
        this.utilityApi.displayFailed(response.errMsg);
      }  
    },()=> {
          this.isLoading = false;
          this.utilityApi.displayError('Unable to fetch GIP transactions');
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

  getGipTransactionResult(): void 
  {
    if(this.transactionFilter.valid) {
      this.isLoading = true;
      this.renderer.addClass(this.tableDivView.nativeElement,'hidden');
      const transactionParam = {
        fromdate : this.utilityApi.transformDate(this.transactionFilter.value.StartDate._d),
        todate   : this.utilityApi.transformDate(this.transactionFilter.value.EndDate._d)
      };
      this.isResultEmpty = false;
      this.utilityApi.getGIPTransactionsByDate(transactionParam).subscribe(response => {
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

  getGipTransactions() : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getGIPReports()
          .subscribe((response: any) => {
            resolve(response);
          },()=> {
            reject();
          });
    });
  }

}
