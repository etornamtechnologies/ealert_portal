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
  selector: 'app-sms-report',
  templateUrl: './birthday-email-report.component.html',
  styleUrls: ['./birthday-email-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class BirthdayEmailReportComponent implements OnInit {

  reportFilter: FormGroup;
  displayedColumns: string[] = ['account_number','phone_number','gateway_response','time_created'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  smsLogs: any[] = [];
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
    private _formBuilder: FormBuilder,
    private splashScreen: FuseSplashScreenService,
  ) { 
      this.reportFilter = this._formBuilder.group({
        SearchValue   : [''],
        StartDate : ['', Validators.required],
        EndDate : ['', Validators.required]
      });
    }

  ngOnInit(): void 
  {
    this.isLoading = false;
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.result = [];
    
  }

  applyFilter(filterValue: string): void
  {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  fetchAllTransaction(){
      // fetch data from filter
      console.log('form data', this.reportFilter.value)
      if(!this.reportFilter.valid) {
        return;
      }
      const today = moment()
      const queryData = {
        filter          : this.reportFilter.value.SearchValue,
        startDate       :this.reportFilter.value.StartDate ? moment(this.reportFilter.value.StartDate).format('YYYY-MM-DD') : moment(today).format('YYYY-MM-DD'),
        endDate         : this.reportFilter.value.EndDate ? moment(this.reportFilter.value.EndDate).format('YYYY-MM-DD') : moment(today).format('YYYY-MM-DD')
      };
      console.log(queryData);
      this.splashScreen.show();
      this.utilityApi.getBirthdayEmailReports(queryData).subscribe((response: any) => {
        console.log(response);
        this.splashScreen.hide();
        if (response.code == 200) {
          console.log('got the data'+ response.data);
          this.smsLogs = response.data.result;
          this.totalCount = response.data?.total
          this.successCount = response.data?.successful
          this.pendingCount = response.data?.pending
          this.failedCount = response.data?.failed
          this.dataSource = new MatTableDataSource(this.smsLogs);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
          if (this.smsLogs.length === 0) {
            this.isResultEmpty = true;
          }
        }else {
          this.isLoading = false;
          this.utilityApi.displayFailed(response.errMsg);
        }  
      },()=> {
            this.isLoading = false;
            this.utilityApi.displayError('Unable to fetch unauthorized customers');
            this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
      });

    
  }



  // getSmsTransactions() : Promise<any>
  // { 
  //   if (this.reportFilter.valid) {
  //   let startdate = this.reportFilter.value.StartDate._i['date'] + '/' +this.reportFilter.value.StartDate._i['month'] + '/' + this.reportFilter.value.StartDate._i['year']
  //   let enddate = this.reportFilter.value.EndDate._i['date'] + '/' +this.reportFilter.value.EndDate._i['month'] + '/' + this.reportFilter.value.EndDate._i['year']
  //   const queryData = {
  //     fromDate        : startdate,
  //     toDate          : enddate, //this.reportfilter.value.EndDate,
  //     status          : this.reportFilter.value.Status,
    
  //   };
    
  //   console.log(queryData);
  //   return;
  //   return new Promise((resolve, reject) => {
  //     this.utilityApi.getSMSTransactionReports(queryData)
  //         .subscribe((response: any) => {
  //           resolve(response);
  //         },()=> {
  //           reject();
  //         });
  //   });
  // }
  // }






  // this.getSmsTransactions().then(response => {
  //   if (response.code === 200) {
  //     this.smsLogs = response.data.report;
  //     this.dataSource = new MatTableDataSource(this.smsLogs);
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //     this.isLoading = false;
  //     this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
  //     if (this.smsLogs.length === 0) {
  //       this.isResultEmpty = true;
  //     }
  //   }else {
  //     this.isLoading = false;
  //     this.utilityApi.displayFailed(response.errMsg);
  //   }  
  // },()=> {
  //       this.isLoading = false;
  //       this.utilityApi.displayError('Unable to fetch SMS reports');
  //       this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
  // });












  // featchBroadcastReport(): void 
  // {
  //   if (this.reportfilter.valid) {
  //     let startdate = this.reportfilter.value.StartDate._i['date'] + '/' +this.reportfilter.value.StartDate._i['month'] + '/' + this.reportfilter.value.StartDate._i['year']
  //     let enddate = this.reportfilter.value.EndDate._i['date'] + '/' +this.reportfilter.value.EndDate._i['month'] + '/' + this.reportfilter.value.EndDate._i['year']
  //     const queryData = {
  //       fromDate        : startdate,
  //       toDate          : enddate, //this.reportfilter.value.EndDate,
  //       status          : this.reportfilter.value.Status,
      
  //     };
  //     console.log(queryData);
  //     this.isLoading = true;
  //     this.utilityApi.getBroadcastReport(queryData).subscribe((response: any) => {
  //     console.log(response);
  //     if (response.code === 200) {
  //       console.log('got the data'+ response.data);
  //       this.braodcastsmsRecord = response.data;
  //       this.dataSource = new MatTableDataSource(this.braodcastsmsRecord);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //       this.isLoading = false;
  //       this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
  //       if (this.braodcastsmsRecord.length === 0) {
  //         this.isResultEmpty = true;
  //       }
  //     }else {
  //       this.isLoading = false;
  //       this.utilityApi.displayFailed(response.errMsg);
  //     }  
  //   },()=> {
  //         this.isLoading = false;
  //         this.utilityApi.displayError('Unable to fetch unauthorized customers');
  //         this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
  //   });
  // }

  // }





  getSmsReportResult(): void 
  {
      if (this.reportFilter.value.StartDate === '' 
        && this.reportFilter.value.EndDate === '' && 
        this.reportFilter.value.PhoneNumber === ''){
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
        fromdate : startDate,
        todate   : endDate,
        phone    : this.reportFilter.value.PhoneNumber
      };
      this.isResultEmpty = false;
      this.utilityApi.getSmsReportByFilter(reportParam).subscribe(response => {
        if (response.errCode === 0) {
          this.smsLogs = response.data.report;
          this.dataSource = new MatTableDataSource(this.smsLogs);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (this.smsLogs.length === 0) {
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
