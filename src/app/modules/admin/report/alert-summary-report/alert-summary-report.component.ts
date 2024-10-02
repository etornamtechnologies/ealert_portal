import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AlertStatusEnum, AlertTypesEnum } from 'app/modules/models/alert.models';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'alert-summary-report',
  templateUrl: './alert-summary-report.component.html',
  styleUrls: ['./alert-summary-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AlertSummaryReportComponent implements OnInit {

  alertSummaryFilter: FormGroup;
  displayedColumns: string[] = ['maker_id','user_branch', 'ip_address','action_meth','action_cont','acc_num','timestamp'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = false;
  isResultEmpty:boolean = false;
  activityLogs: any[] = [];
  data:  number;
  alertType: AlertTypesEnum
  status: AlertStatusEnum

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;
  
  constructor(
    private utilityApi: UtilityService,
    private renderer: Renderer2,
    private _formBuilder: FormBuilder
  ) {
      this.alertSummaryFilter = this._formBuilder.group({
        StartDate  : ['',Validators.required],
        EndDate    : ['',Validators.required],
        Status     : ['', Validators.required]
      });
    }

  ngOnInit(): void 
  {
    this.dataSource = new MatTableDataSource(this.activityLogs);
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

  getAlertSummaryReport(): void 
  {
    if(this.alertSummaryFilter.valid) {
      //this.isLoading = true;
      this.renderer.addClass(this.tableDivView.nativeElement,'hidden');
      const queryParam = {
        startDate : this.utilityApi.transformDate(this.alertSummaryFilter.value.StartDate._d),
        endDate   : this.utilityApi.transformDate(this.alertSummaryFilter.value.EndDate._d),
        status    : this.alertSummaryFilter.value.Status
      };

      console.log('payload', queryParam)

      this.isResultEmpty = false;
      this.utilityApi.getAlertSummaryReport(queryParam).subscribe(response => {
        console.log('response', response)
        if (response.code === 200) {
          this.activityLogs = response.data;
          this.dataSource = new MatTableDataSource(this.activityLogs);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (this.activityLogs.length === 0) {
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
