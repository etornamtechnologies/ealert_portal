import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { UtilityService} from 'app/shared/services/utility.service';
import _ from 'lodash';
import { VerifyCustomerExemptionComponent } from './verify-customer/verify-customer.component';

@Component({
  selector: 'app-customer-exemption',
  templateUrl: './customer-exemption.component.html',
  styleUrls: ['./customer-exemption.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class CustomerExemptionComponent implements OnInit {
  displayedColumns: string[] = ['CustomerNumber','CustomerName','PhoneNumber','email','ModifiedDate'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = true;
  isResultEmpty:boolean = false;
  customers: any[] = [];
  userBranch: string;
  fileUploadForm: FormGroup;
  customerData: any;
  username: string;
  dialogRef: MatDialogRef<VerifyCustomerExemptionComponent>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;
  isAccountsVerified: boolean;
  
  
  



  constructor(
    private utilityApi: UtilityService,
    private splashScreen: FuseSplashScreenService,
    private renderer: Renderer2,
    private route: Router, 
    private confirmationDialog: FuseConfirmationService,
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,
    
  
  ) {
    this.fileUploadForm = this._formBuilder.group({
      myfile  : ['',Validators.required],
      // customerIdentify   : ['']
    });

  }

  
  ngOnInit(): void {
    this.getExemptedCustomers().then(response => {
      if (response.code === 200) {
        console.log(response.data);
        this.customers = response.data;
        this.dataSource = new MatTableDataSource(this.customers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.customers.length === 0) {
          this.isResultEmpty = true;
        }
      }else {
        this.utilityApi.displayError(response.errMsg);
      } 
      this.isLoading = false;
      
    },()=> {
          this.isLoading = false;
          this.utilityApi.displayError('Unable to fetch Customers');
    
    });

    



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

    // fool
    this.splashScreen.hide();
    this.dialogRef = this._matDialog.open(VerifyCustomerExemptionComponent,{
      
      data: {
        accounts : [{'accountNumber':'12345','customerName':'sendtra'}]
       },
      minWidth : '750',
      disableClose: false
    });
    return;
    // fool
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
        this.dialogRef = this._matDialog.open(VerifyCustomerExemptionComponent,{
          data: {
            accounts : this.customers
           },
          minWidth : '750',
          disableClose: false
        });
        this.isLoading = false;
        this.isAccountsVerified=true;
        

        this.splashScreen.hide();

        
      }
      else {
        this.utilityApi.displayFailed(response.errMsg,'Cutomer details fetch failed');
      }
    },()=> {
      this.splashScreen.hide();
      this.utilityApi.displayFailed('Customer account details fetch failed');
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


  onFileSelect(event:any) {
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


  getExemptedCustomers() : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.GET_EXEMPTED_CUST()
          .subscribe((response: any) => {
            resolve(response);
          },()=> {
            reject();
          });
    });
  }


  SubmitCustomer()
    // this.utilityApi.createCustomerBulk(JSON.stringify(this.customers)).subscribe(response =>{
  {
        const dialogRef = this.confirmationDialog.open({
          "title": "Bulk Customer Exemption",
          "message": `Kindly verify details of customer before submission  </br><span class="text-lg font-semibold">Total of:${this.customers.length} ?</span>`,
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
              this.utilityApi.exemptCustomerBulk(JSON.stringify(custlist)).subscribe(response =>{
                this.splashScreen.hide();
                if (response.code === 200) {
                  this.utilityApi.displaySuccess('Customer exemption successfully uploaded');
                }else {
                  this.utilityApi.displayFailed('Customer exemption submission process failed try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('Customer exemption process failed, server error.');
              });
              }
          });
     }



}
