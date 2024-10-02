import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-account-class-exemption',
  templateUrl: './account-class-exemption.component.html',
  styleUrls: ['./account-class-exemption.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AccountClassExemptionComponent implements OnInit {

  reportFilter: FormGroup;
  displayedColumns: string[] = ['account_class','class_name','created_by','created_date','actions'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  smsLogs: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;

  constructor(
    private utilityApi: UtilityService,
    private renderer: Renderer2,
    private _formBuilder: FormBuilder
  ) { 
      this.reportFilter = this._formBuilder.group({
        AccountClass : ['',Validators.required]
      });
    }

  ngOnInit(): void 
  {
    this.getSmsTransactions().then(response => {
      if (response.errCode === 0) {
        this.smsLogs = response.data.report;
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

  remove(department : any): void 
  {

  }

  getSmsReportResult(): void 
  {
      if(this.reportFilter.valid) 
      {
        
      }
  }

}
