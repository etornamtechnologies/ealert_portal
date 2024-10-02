import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class DepartmentsComponent implements OnInit {

  reportFilter: FormGroup;
  displayedColumns: string[] = ['department_name','actions'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  departments: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;
  

  constructor(
    private utilityApi: UtilityService,
    private renderer: Renderer2,
    private _formBuilder: FormBuilder,
    private splashScreen: FuseSplashScreenService,
    private confirmationDialog: FuseConfirmationService
  ) { 
      this.reportFilter = this._formBuilder.group({
        Department : ['',Validators.required]
      });
    }

  ngOnInit(): void 
  {
    this.getDepartments().then(response => {
      if (response.code === 200) {
        this.departments = response.data;
        this.dataSource = new MatTableDataSource(this.departments);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
        this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
        if (this.departments.length === 0) {
          this.isResultEmpty = true;
        }
      }else {
        this.isLoading = false;
        this.utilityApi.displayFailed(response.message);
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

  getDepartments() : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getDepartments()
          .subscribe((response: any) => {
            resolve(response);
          },()=> {
            reject();
          });
    });
  }

  deleteDepartment(departmentData : any):  void {
        
        const dialogRef = this.confirmationDialog.open({
          "title": "Department Creation",
          "message": `Are you sure you want to remove </br><span class="text-lg font-semibold">${departmentData.departmentName}</span> Department ?`,
          "icon": {
            "show": true,
            "name": "heroicons_outline:trash",
            "color": "warn"
          },
          "actions": {
            "confirm": {
              "show": true,
              "label": "Delete",
              "color": "warn"
            },
            "cancel": {
              "show": true,
              "label": "Cancel"
            }
          },
          "dismissible": true
        });
  
          dialogRef.afterClosed().subscribe((result) => {
              if (result === 'confirmed') {
                this.splashScreen.show();
              //   const admin = {
              //     department : departmentData
              // };
              this.utilityApi.removeDepartment(departmentData).subscribe(response =>{
                this.splashScreen.hide();
                if (response.code === 200) {
                  this.utilityApi.displaySuccess('Department Deleted successfully');
                }else {
                  this.utilityApi.displayFailed('Department failed to delete, try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('Department failed to delete, server error.');
              });
              }
          });
    }

  createDepartment() : void {
    if (!this.reportFilter.valid)
        {return;}
    let departmentName = this.reportFilter.value.Department
        const dialogRef = this.confirmationDialog.open({
          "title": "Department Creation",
          "message": `Are you sure you want to create Department </br><span class="text-lg font-semibold">${departmentName}</span> ?`,
          "icon": {
            "show": true,
            "name": "heroicons_outline:trash",
            "color": "warn"
          },
          "actions": {
            "confirm": {
              "show": true,
              "label": "Create",
              "color": "primary"
            },
            "cancel": {
              "show": true,
              "label": "Cancel"
            }
          },
          "dismissible": true
        });
  
          dialogRef.afterClosed().subscribe((result) => {
              if (result === 'confirmed') {
                this.splashScreen.show();
                const admin = {
                  departmentName : departmentName
              };
              this.utilityApi.createDepartment(JSON.stringify(admin)).subscribe(response =>{
                this.splashScreen.hide();
                if (response.code === 200) {
                  this.utilityApi.displaySuccess('Department Created successfully');
                }else {
                  this.utilityApi.displayFailed('Department creation failed, try again later.\n'+response.message);
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('Department creation failed, server error.');
              });
              }
          });
    }
  
  

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
        if (response.code === 200) {
          this.departments = response.data.report;
          this.dataSource = new MatTableDataSource(this.departments);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (this.departments.length === 0) {
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
