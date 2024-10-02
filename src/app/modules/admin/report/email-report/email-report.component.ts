import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { UtilityService } from 'app/shared/services/utility.service';
import moment from 'moment';
import * as XLSX from "xlsx";


@Component({
  selector: 'app-email-report',
  templateUrl: './email-report.component.html',
  styleUrls: ['./email-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EmailReportComponent implements OnInit {

  reportFilter: FormGroup;
  displayedColumns: string[] = ['account_number', 'tran_date', 'sent', 'email', 'subject', 'timeStamp'];
  dataSource: MatTableDataSource<any>;
  isLoading: boolean = true;
  isResultEmpty: boolean = true;
  emailLogs: any[] = [];
  permissions: any[];
  roles: any[];
  result: any[];
  totalCount: number;
  successCount: number
  failedCount: number
  pendingCount: number

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
      SearchValue: [''],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required]
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
  }

  fetchAllTransaction() {
    // fetch data from filter
    if(!this.reportFilter.valid){
      return;
    }
    this.isLoading
    const queryData = {
      filter: this.reportFilter.value.SearchValue,
      startDate: moment(this.reportFilter.value.StartDate).format('YYYY-MM-DD'),
      endDate: moment(this.reportFilter.value.EndDate).format('YYYY-MM-DD')
    };
    console.log(queryData);
    this.splashScreen.show();
    this.utilityApi.getEmailTransactionReports(queryData).subscribe((response: any) => {
      console.log(response);
      this.splashScreen.hide();
      if (response.code == 200) {
        
        this.emailLogs = response.data.result;
        this.dataSource = new MatTableDataSource(this.emailLogs);
        this.totalCount = response.data?.total
        this.successCount = response.data?.successful
        this.pendingCount = response.data?.pending
        this.failedCount = response.data?.failed
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
        this.renderer.removeClass(this.tableDivView.nativeElement, 'hidden');
        if (this.emailLogs.length === 0) {
          this.isResultEmpty = true;
        } else {
          this.isResultEmpty = false;
        }
      } else {
        this.isLoading = false;
        this.utilityApi.displayFailed(response.errMsg);
      }
    }, () => {
      this.isLoading = false;
      this.utilityApi.displayError('Unable to fetch unauthorized customers');
      this.renderer.removeClass(this.tableDivView.nativeElement, 'hidden');
    });


  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getEmailAlerts(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.utilityApi.getEmailReports()
        .subscribe((response: any) => {
          resolve(response);
        }, () => {
          reject();
        });
    });
  }

  getEmailReportResult(): void {
    if (this.reportFilter.value.StartDate === ''
      && this.reportFilter.value.EndDate === '' &&
      this.reportFilter.value.Email === '') {
      this.utilityApi.displayError('Please select at least one search criteria');
      return;
    }
    this.isLoading = true;
    this.renderer.addClass(this.tableDivView.nativeElement, 'hidden');
    let startDate = '';
    let endDate = '';
    if (this.reportFilter.value.StartDate !== '') {
      startDate = this.utilityApi.transformDate(this.reportFilter.value.StartDate._d);
    }
    if (this.reportFilter.value.EndDate !== '') {
      endDate = this.utilityApi.transformDate(this.reportFilter.value.EndDate._d);
    }
    const reportParam = {
      fromdate: startDate,
      todate: endDate,
      email: this.reportFilter.value.Email
    };
    this.isResultEmpty = false;
    this.utilityApi.getEmailReportByFilter(reportParam).subscribe(response => {
      if (response.errCode === 0) {
        this.emailLogs = response.data.report;
        this.dataSource = new MatTableDataSource(this.emailLogs);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.emailLogs.length === 0) {
          this.isResultEmpty = true;
        } else {
          this.isResultEmpty = false;
        }
      } else {
        this.utilityApi.displayFailed(response.errMsg);
      }
      this.isLoading = false;
      this.renderer.removeClass(this.tableDivView.nativeElement, 'hidden');
    }, () => {
      this.isLoading = false;
      this.renderer.removeClass(this.tableDivView.nativeElement, 'hidden');
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
