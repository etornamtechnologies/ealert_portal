import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-otp-report',
  templateUrl: './otp-report.component.html',
  styleUrls: ['./otp-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class OtpReportComponent implements OnInit {

  reportFilter: FormGroup;
  displayedColumns: string[] = ['account_number','phone_number','email','otp','status','time_created'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  otpLogs: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;

  constructor(
    private utilityApi: UtilityService,
    private renderer: Renderer2,
    private _formBuilder: FormBuilder
  ) {
      this.reportFilter = this._formBuilder.group({
        StartDate   : '',
        EndDate     : '',
        PhoneNumber : ''
      });
    }

  ngOnInit(): void 
  {
    this.getOtpTransactions().then(response => {
      if (response.errCode === 0) {
        this.otpLogs = response.data.report;
        this.dataSource = new MatTableDataSource(this.otpLogs);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
        this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
        if (this.otpLogs.length === 0) {
          this.isResultEmpty = true;
        }
      }else {
        this.isLoading = false;
        this.utilityApi.displayFailed(response.errMsg);
      }  
    },()=> {
          this.isLoading = false;
          this.utilityApi.displayError('Unable to fetch OTP reports');
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

  getOtpTransactions() : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getOTPReports()
          .subscribe((response: any) => {
            resolve(response);
          },()=> {
            reject();
          });
    });
  }

  getOtpStatus(status: string): string
  {
    if (status == '1') {
      return 'USED';
    } else if(status == '2') {
      return ' INVALID';
    }else {
      return 'UNUSED';
    }
  }

  getOtpReportResult(): void 
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
    this.utilityApi.getOTPReportByFilter(reportParam).subscribe(response => {
      if (response.errCode === 0) {
        this.otpLogs = response.data.report;
        this.dataSource = new MatTableDataSource(this.otpLogs);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.otpLogs.length === 0) {
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
