import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-subscriber-report',
  templateUrl: './subscriber-report.component.html',
  styleUrls: ['./subscriber-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class SubscriberReportComponent implements OnInit {

  subcriberFilter: FormGroup;
  displayedColumns: string[] = ['date_created','username','account','phone','fname','lname','auth_status','created_by','city'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = false;
  isResultEmpty:boolean = false;
  subscribers: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;

  constructor(
    private utilityApi: UtilityService,
    private splashScreen: FuseSplashScreenService,
    private renderer: Renderer2,
    private _formBuilder: FormBuilder
  ) { 
    this.subcriberFilter = this._formBuilder.group({
      StartDate  : ['',Validators.required],
      EndDate    : ['',Validators.required]
    });
  }

  ngOnInit(): void 
  {
    this.dataSource = new MatTableDataSource(this.subscribers);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getSubscriberResult(): void 
  {
    if(this.subcriberFilter.valid) {
      this.isLoading = true;
      this.renderer.addClass(this.tableDivView.nativeElement,'hidden');
      const transactionParam = {
        fromdate : this.utilityApi.transformDate(this.subcriberFilter.value.StartDate._d),
        todate   : this.utilityApi.transformDate(this.subcriberFilter.value.EndDate._d)
      };
      this.isResultEmpty = false;
      this.utilityApi.getSubscribersByDate(transactionParam).subscribe(response => {
        if (response.errCode === 0) {
          this.subscribers = response.data.subscribers;
          this.dataSource = new MatTableDataSource(this.subscribers);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (this.subscribers.length === 0) {
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

  exportSubscribersData() : void 
  {
    if(this.subcriberFilter.value.StartDate === '') 
    {
      this.utilityApi.displayError('Please select start date');
      return;
    }
    if(this.subcriberFilter.value.EndDate === '') 
    {
      this.utilityApi.displayError('Please select end date');
      return;
    }

    this.splashScreen.show();
    const transactionParam = {
      fromdate : this.utilityApi.transformDate(this.subcriberFilter.value.StartDate._d),
      todate   : this.utilityApi.transformDate(this.subcriberFilter.value.EndDate._d)
    };
    this.utilityApi.exportSubscribersData(transactionParam).subscribe(response => {
      if (response !== null) {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        downloadLink.setAttribute('download', 'subscriber-report.xlsx');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.parentNode.removeChild(downloadLink);
      }else {
        this.utilityApi.displayFailed('Error occurred, unable to export subscriber data.');
      }
      this.splashScreen.hide();
    },()=>{
      this.splashScreen.hide();
      this.utilityApi.displayFailed('Error occurred, unable to export subscriber data.');
    });

  }

  exportSubscribersByBranchData() : void 
  {
    if(this.subcriberFilter.value.StartDate === '') 
    {
      this.utilityApi.displayError('Please select start date');
      return;
    }
    if(this.subcriberFilter.value.EndDate === '') 
    {
      this.utilityApi.displayError('Please select end date');
      return;
    }
    this.splashScreen.show();
    const transactionParam = {
      fromdate : this.utilityApi.transformDate(this.subcriberFilter.value.StartDate._d),
      todate   : this.utilityApi.transformDate(this.subcriberFilter.value.EndDate._d)
    };
    this.utilityApi.exportSubscribersByBranchData(transactionParam).subscribe(response => {
      if (response !== null) {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        downloadLink.setAttribute('download', 'branch-subscriber-report.xlsx');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.parentNode.removeChild(downloadLink);
      }else {
        this.utilityApi.displayFailed('Error occurred, unable to export subscriber data.');
      }
      this.splashScreen.hide();
    },()=>{
      this.splashScreen.hide();
      this.utilityApi.displayFailed('Error occurred, unable to export subscriber data.');
    });
  }

}
