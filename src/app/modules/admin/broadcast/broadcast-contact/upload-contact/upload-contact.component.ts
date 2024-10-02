import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen/splash-screen.service';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilityService } from 'app/shared/services/utility.service';
import _ from 'lodash';

@Component({
  selector: 'app-upload-contact',
  templateUrl: './upload-contact.component.html',
  styleUrls: ['./upload-contact.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class UploadContactComponent implements OnInit {

  customers: any[] = [];
  customerData: any;

  
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

  cancelsubmit(){
    location.reload();
    return false;
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
    this.utilityApi.submitBulkContactUpload(formData).subscribe(response =>{
      this.splashScreen.hide();
      if(response.code === 200) {
        console.log(response);
        // this is where we would populate the table
        if ( response.data.length < 1){
          this.splashScreen.hide();
          this.utilityApi.displayFailed(response.errMsg,'Bulk Cutomer details fetch failed');
          return; 
        }
        console.log(response);
        this.customers = response.data;
        this.utilityApi.displaySuccessNoReload('Bulk Cutomer details Uploaded Succesfully');
        // this.dataSource = new MatTableDataSource(this.customers);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        // this.isLoading = false;
        // this.isAccountsVerified=true;
        

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
                username : ''//this.username
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


}
