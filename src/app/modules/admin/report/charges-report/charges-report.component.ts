import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { UtilityService } from 'app/shared/services/utility.service';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-charges-report',
  templateUrl: './charges-report.component.html',
  styleUrls: ['./charges-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ChargesReportComponent implements OnInit {

  reportFilter: FormGroup;
  displayedColumns: string[] = ['account_number', 'account_branch', 'amount', 'charge', 'processed_on', 'processed_by'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  months: any[];
  years: any[];
  chargeLogs: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;

  constructor(
    private utilityApi: UtilityService,
    private renderer: Renderer2,
    private splashScreen: FuseSplashScreenService,
    private _formBuilder: FormBuilder
  ) { 
    this.reportFilter = this._formBuilder.group({
      Month  : ['',Validators.required],
      Year    : ['',Validators.required],
      Status     : ['',Validators.required]
    });
  }

  ngOnInit(): void {
    // this.getEmailAlerts().then(response => {
    //   if (response.errCode === 0) {
    //     this.emailLogs = response.data.report;
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = false;
    // this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
    //     if (this.emailLogs.length === 0) {
    //       this.isResultEmpty = true;
    //     }
    //   }else {
    //     this.isLoading = false;
    //     this.utilityApi.displayFailed(response.errMsg);
    //   }  
    // },()=> {
    //       this.isLoading = false;
    //       this.utilityApi.displayError('Unable to fetch email reports');
    //       this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
    // });
    this.splashScreen.show();
    this.utilityApi.getMonths().subscribe(
        (response) => {
            if (response.code === 200) {
                this.months = response.data;
            } else {
                this.utilityApi.displayError('Unable to fetch months');
            }
            this.splashScreen.hide();
        },
        () => {
            this.splashScreen.hide();
            this.utilityApi.displayError('Unable to fetch months');
        }
    );
    this.splashScreen.show();
    this.utilityApi.getYears().subscribe(
        (response) => {
            if (response.code === 200) {
                this.years = response.data;
            } else {
                this.utilityApi.displayError('Unable to fetch years');
            }
            this.splashScreen.hide();
        },
        () => {
            this.splashScreen.hide();
            this.utilityApi.displayError('Unable to fetch years');
        }
    );   
  }

  
  fetchAllTransaction()
  {
    console.log(this.reportFilter.value.Month);
    console.log(this.reportFilter.value.Year);
    console.log(this.reportFilter.valid);
      const queryData = {
        month        :  this.reportFilter.value.Month,
        year          : this.reportFilter.value.Year,
      };
    console.log(queryData);
    this.splashScreen.show();
    this.utilityApi.getChargeTransactionReports(queryData).subscribe((response: any) => {
      console.log(response);
      this.splashScreen.hide();
      if (response.code == 200) {
        console.log('got the data'+ response.data);
        this.chargeLogs = response.data;
        this.dataSource = new MatTableDataSource(this.chargeLogs);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
        this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
        if (this.chargeLogs.length === 0) {
          this.isResultEmpty = true;
        }
      }else {
        this.isLoading = false;
        this.utilityApi.displayFailed(response.errMsg);
      }  
    },()=> {
          this.isLoading = false;
          this.utilityApi.displayError('Unable to fetch unauthorized charges');
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
    });

  ;
  }
  

  applyFilter(filterValue: string): void
  {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getEmailAlerts() : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getEmailReports()
          .subscribe((response: any) => {
            resolve(response);
          },()=> {
            reject();
          });
    });
  }

  getChargesReportResult(): void 
  {
    if (this.reportFilter.value.Year === '' 
      && this.reportFilter.value.Month === ''){
      this.utilityApi.displayError('Please select at least one search criteria');
      return;
    }
    this.isLoading = true;
    this.renderer.addClass(this.tableDivView.nativeElement,'hidden');
    let startDate = '';
    let endDate = '';
    if(this.reportFilter.value.StartDate !== ''){
      startDate = this.utilityApi.transformDate(this.reportFilter.value.StartDate._d);
    }
    if(this.reportFilter.value.EndDate !== ''){
      endDate = this.utilityApi.transformDate(this.reportFilter.value.EndDate._d);
    }
    const reportParam = {
      month : startDate,
      year  : endDate,
    };
    this.isResultEmpty = false;
    this.utilityApi.getEmailReportByFilter(reportParam).subscribe(response => {
      if (response.errCode === 0) {
        this.chargeLogs = response.data.report;
        this.dataSource = new MatTableDataSource(this.chargeLogs);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.chargeLogs.length === 0) {
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

  exportToExcel(): void {
    const workSheet = XLSX.utils.json_to_sheet(
        this.dataSource.filteredData
    );
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
    XLSX.writeFile(workBook, "filename.xlsx");
  }
}
