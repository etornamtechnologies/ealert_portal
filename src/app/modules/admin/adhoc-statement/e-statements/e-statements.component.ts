import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-e-statements',
  templateUrl: './e-statements.component.html',
  styleUrls: ['./e-statements.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class EStatementsComponent implements OnInit {

  displayedColumns: string[] = ['account_desc','account_no','cust_id','actions'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  customers: any[] = [];
  userBranch: string;
  username: string;
  StatementForm: FormGroup;
  //dialogRef: MatDialogRef<ViewCustomerDetailsComponent>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;
  
  constructor(
    private utilityApi: UtilityService,
    private splashScreen: FuseSplashScreenService,
    private renderer: Renderer2,
    private _formBuilder: FormBuilder,
    private confirmationDialog: FuseConfirmationService,
    private _matDialog: MatDialog,
    private authService: AuthService
  ) { 
    this.userBranch = this.authService.getLoggedInUserDetails().branch;
    this.username = this.authService.getLoggedInUserDetails().username;
    this.StatementForm = this._formBuilder.group({
      accountNumber  : [''],//['',Validators.required],
      StartDate      : ['',Validators.required],
      EndDate        : ['',Validators.required],
    });
  }

  ngOnInit(): void 
  {

    this.dataSource = new MatTableDataSource(this.customers);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = false;


    // this.getUnauthorizedCustomers('D',this.userBranch).then(response => {
    //   if (response.errCode === 0) {
    //     this.customers = response.data.customers;
    //     this.dataSource = new MatTableDataSource(this.customers);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //     this.isLoading = false;
    //     this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
    //     if (this.customers.length === 0) {
    //       this.isResultEmpty = true;
    //     }
    //   }else {
    //     this.isLoading = false;
    //     this.utilityApi.displayFailed(response.errMsg);
    //   }  
    // },()=> {
    //       this.isLoading = false;
    //       this.utilityApi.displayError('Unable to fetch unauthorized customers');
    //       this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
    // });
  }

  getUnauthorizedCustomers(status: string, branch: string) : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getCustomersByAuthStat(status,branch)
          .subscribe((response: any) => {
            resolve(response);
          },()=> {
            reject();
          });
    });
  }



  applyFilter(filterValue: string): void
  {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  fetchRecords(): void 
  {

    // if (this.StatementForm.value.accountNumber) {
      this.isResultEmpty = false;
      const searchObj = {
        accOrName : this.StatementForm.value.accountNumber,
        // endDate  : this.StatementForm.value.endDate,
        // startDate : this.StatementForm.value.startDate,
      };
      this.isLoading = true;
      this.renderer.addClass(this.tableDivView.nativeElement,'hidden');
      this.utilityApi.searchCustomerForStatement(searchObj).subscribe(response =>{
        if (response.code == 200) {
          this.customers = response.data;
          this.dataSource = new MatTableDataSource(this.customers);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
          if (this.customers.length === 0) {
            this.isResultEmpty = true;
          }
        }else {
          this.isLoading = false;
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
          this.utilityApi.displayFailed(response.errMsg);
        }
      },()=> {
        this.isLoading = false;
        this.utilityApi.displayError('Unable to fetch customers');
        this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
      });
    // }
  }






  generateStatment(custDetails : any) : void 
  { let custDetailsRec: any;


    if (!this.StatementForm.valid) {

        this.utilityApi.displayFailed('Please select date range','Required fields');
        return;
    }

    // this.getCustDetails(custDetails.custNo);
    this.splashScreen.show();
    this.utilityApi.fetchCustomerForStatePrintout(custDetails.custNo).subscribe(response =>{
      if (response.code == 200) {
        this.splashScreen.hide();
        custDetailsRec = response.data;
        const customer = {
          customerName: custDetailsRec.customerName,
          customerId:custDetailsRec.customerId,
          email:custDetailsRec.email,
          phoneNumber:custDetailsRec.phoneNumber,
          fromDate:String(this.StatementForm.value.StartDate._i['date']).padStart(2, "0") + '/' + String(this.StatementForm.value.StartDate._i['month']+1).padStart(2, "0") + '/' + this.StatementForm.value.StartDate._i['year'],// this.StatementForm.value.startDate,//need to change
          toDate:  String(this.StatementForm.value.EndDate._i['date']).padStart(2, "0") + '/' + String(this.StatementForm.value.EndDate._i['month']+1).padStart(2, "0") + '/' + this.StatementForm.value.EndDate._i['year'],
          accountNumber : custDetailsRec.accountNumber,
          stmntType:''
      };

      this.submitDetails(customer);

      }else {
        this.splashScreen.hide();
        this.utilityApi.displayFailed(response.message);
        return;
      }
      this.isLoading = false;
      return;
    },()=> {
      this.splashScreen.hide();
      this.isLoading = false;
      this.utilityApi.displayError('Unable to fetch customers details for statement');
      return;
    });
    

    

   }


   submitDetails(custDetails):void{
    console.log(custDetails);
    const dialogRef = this.confirmationDialog.open({
      "title": "Generate Customer Statement",
      "message": `Are you sure you want to generate statement for </br><span class="text-lg font-semibold">${custDetails.customerName}?</span>`,
      "icon": {
        "show": true,
        "name": "mat_outline:library_add_check",
        "color": "info"
      },
      "actions": {
        "confirm": {
          "show": true,
          "label": "Generate",
          "color": "accent"
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
          
        this.utilityApi.SendStatement(JSON.stringify(custDetails)).subscribe(response =>{
          this.splashScreen.hide();
          if (response.code === 200) {
            this.utilityApi.displaySuccess('Customer statement successfully generated');
          }else {
            this.utilityApi.displayFailed(response.errMsg + 'Customer statement generation failed try again later.');
          }
        },()=>{
          this.splashScreen.hide();
          this.utilityApi.displayFailed('Customer statement generation failed, server error.');
        });
        }
    });

   }




   getCustDetails(custId): any 
  {

    if (custId) {
      this.isResultEmpty = false;
      this.isLoading = true;
      this.utilityApi.searchCustomerForStatement(custId).subscribe(response =>{
        if (response.code == 200) {
          return response.data;
        }else {
          this.utilityApi.displayFailed(response.errMsg);
        }
        this.isLoading = false;
      },()=> {
        this.isLoading = false;
        this.utilityApi.displayError('Unable to fetch customers');
      });
    }



  }






   /* viewCustomerDetails(userDetails : any) : void 
   {
    this.dialogRef = this._matDialog.open(ViewCustomerDetailsComponent,{
      data: {
        userDetails
       },
      width : '500px',
      disableClose: false
    });
   } */

}
