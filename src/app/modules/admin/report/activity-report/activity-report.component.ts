import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-activity-report',
  templateUrl: './activity-report.component.html',
  styleUrls: ['./activity-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ActivityReportComponent implements OnInit {

  activityLogFilter: FormGroup;
  displayedColumns: string[] = ['maker_id','user_branch', 'ip_address','action_meth','action_cont','acc_num','timestamp'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = false;
  isResultEmpty:boolean = false;
  activityLogs: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;
  
  constructor(
    private utilityApi: UtilityService,
    private renderer: Renderer2,
    private _formBuilder: FormBuilder
  ) {
      this.activityLogFilter = this._formBuilder.group({
        StartDate  : ['',Validators.required],
        EndDate    : ['',Validators.required]
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

  getActivityReportResult(): void 
  {
    if(this.activityLogFilter.valid) {
      this.isLoading = true;
      this.renderer.addClass(this.tableDivView.nativeElement,'hidden');
      const queryParam = {
        startDate : this.utilityApi.transformDate(this.activityLogFilter.value.StartDate._d),
        endDate   : this.utilityApi.transformDate(this.activityLogFilter.value.EndDate._d)
      };
      this.isResultEmpty = false;
      this.utilityApi.getActivityReportByDate(queryParam).subscribe(response => {
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
