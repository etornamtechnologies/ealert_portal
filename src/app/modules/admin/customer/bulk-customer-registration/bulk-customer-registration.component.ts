import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilityService } from 'app/shared/services/utility.service';
import _ from 'lodash';
import { ViewCustomerDetailsComponent } from '../view-customer-details/view-customer-details.component';

@Component({
  selector: 'app-bulk-customer-registration',
  templateUrl: './bulk-customer-registration.component.html',
  styleUrls: ['./bulk-customer-registration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class BulkCustomerRegistrationComponent implements OnInit {

  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  fileUploadForm: FormGroup;
  isAccountsVerified = false;
  customerData: any;
  
  displayedColumns: string[] = ['acctnumber','customerName','smsAlert','emailAlert','Dailystat','WeeklyStat','Monthstat','Yearlystat','birthEmail','birthSmsAlert','crLimit','dbLimit','Religion','tranErrSatus'];
  // displayedColumns: string[] = ['firstname','lastname','email','account_no','phone','actions'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  customers: any[] = [];
  selectedRecord: any[] = [];
  master: boolean = false;
  userBranch: string;
  username: string;
  AdvanceSearch: FormGroup;
  dialogRef: MatDialogRef<ViewCustomerDetailsComponent>;

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
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.fileUploadForm = this.formBuilder.group({
      myfile: ['']
    });
  }

  
  getstatus(accountAlreadyRegistered,accountPendingAuthorisation,accountInvalid)
  {
    if (accountAlreadyRegistered){
      return ({status:true,reason:"Account Already Registered"});
    }
    else if(accountPendingAuthorisation){
      return ({status:true,reason:"Account is pending authorisation"});
    }
    else if(accountInvalid){
      return ({status:true,reason:"Invalid Account"});
    }
    else{
      return ({status:false,reason:""});}


  }

  onFileSelect(event) {
    let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      if (!_.includes(af, file.type)) {
        this.utilityApi.displayFailed('Only EXCEL Docs Allowed!','File not allowed');
      } else {
        this.customerData = file;
        //this.fileUploadForm.get('myfile').setValue(file);
        console.log(this.customerData);
      }
    }
  }


  SubmitExcelTemp() {
    let aff = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (!this.customerData) {
      this.utilityApi.displayError('Please select an excel file');
      return false;
    }
    if (!_.includes(aff, this.customerData.type))
    {
      this.utilityApi.displayError('Only EXCEL Docs Allowed!');
      return false;
    }


    console.log(this.customerData);
    let formData = new FormData();
    formData.set('file', this.customerData);
    console.log(formData);
    this.splashScreen.show();
    this.utilityApi.submitBulkCustomer(formData).subscribe(response =>{
      this.splashScreen.hide();
      if(response.code === 200) {
        // this is where we would populate the table
        if ( response.data.length < 1){
          this.splashScreen.hide();
          this.utilityApi.displayFailed(response.errMsg,'Bulk Cutomer details fetch failed');
          return; 
        }
        console.log(response);
        this.customers = response.data;
        this.dataSource = new MatTableDataSource(this.customers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
        this.isAccountsVerified=true;
        

        this.splashScreen.hide();

        
      }
      else {
        this.utilityApi.displayFailed(response.errMsg,'Bulk Cutomer details fetch failed');
      }
    },()=> {
      this.splashScreen.hide();
      this.utilityApi.displayFailed('Bulk Customer account details fetch failed');
      // return ''
    });


    // this.http.post<any>('http://www.example.com/api/upload', formData).subscribe(response => {
    //     console.log(response);
    //     if (response.statusCode === 200) {
    //       // Reset the file input
    //       this.uploadFileInput.nativeElement.value = "";
    //       this.fileInputLabel = undefined;
    //     }
    //   }, error => {
    //     console.log(error);
    //   });
  
  }



  SubmitCustomer()
    // this.utilityApi.createCustomerBulk(JSON.stringify(this.customers)).subscribe(response =>{
  {
        const dialogRef = this.confirmationDialog.open({
          "title": "Bulk Customer Creation",
          "message": `Kindly verify details of customer before submission Total of: </br><span class="text-lg font-semibold">${this.customers.length} ?</span>`,
          "icon": {
            "show": true,
            "name": "mat_outline:library_add_check",
            "color": "info"
          },
          "actions": {
            "confirm": {
              "show": true,
              "label": "Submit",
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
                const custlist={
                  customers : this.customers
                };
                const admin = {
                username : this.username
            };
              this.utilityApi.createCustomerBulk(JSON.stringify(custlist)).subscribe(response =>{
                this.splashScreen.hide();
                if (response.code === 200) {
                  this.utilityApi.displaySuccess('Customer successfully uploaded, awaiting authorisation');
                }else {
                  this.utilityApi.displayFailed('Customer submission process failed try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('Customer submission process failed, server error.');
              });
              }
          });
     }
  


  cancelsubmit(){
    location.reload();
    return false;


  }


}


