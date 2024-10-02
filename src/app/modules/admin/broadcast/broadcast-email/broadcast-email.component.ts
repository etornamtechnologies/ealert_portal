import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilityService } from 'app/shared/services/utility.service';
import _ from 'lodash';

@Component({
  selector: 'app-broadcast-email',
  templateUrl: './broadcast-email.component.html',
  styleUrls: ['./broadcast-email.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class BroadcastEmailComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;

  EmailBroadcastForm: FormGroup;
  FileUploadForm :FormGroup;
  role:string;
  branches:any[];
  username: string;
  accountType:[];
  broadcatsfile:any[];
  customerListFileData: any;

  //dialogRef: MatDialogRef<ConfirmUserDetailsComponent>;
  filteredBranches: any[] = [];
  selectedImage: any = "assets/images/icons/camera.png";
  frontFileAttr = 'Upload Front Image';
  isImageSelected:boolean = false;
  broadcastNow :boolean = false;
  specificList: boolean = false;
  
  constructor(
    private utilityApi: UtilityService, 
    private _formBuilder: FormBuilder,
    private splashScreen: FuseSplashScreenService,
    private authService: AuthService,
    private _matDialog: MatDialog,
    private confirmationDialog: FuseConfirmationService,
  ) { 
    this.EmailBroadcastForm = this._formBuilder.group({
        Subject       : ['',Validators.required],
        BroadcastDate : ['',Validators.required],
        RunTime       : ['',Validators.required],
        BroadcastNow  : false,
        Broadcastlist : false,
        AccountType   : ['',Validators.required],
        Religion      : ['',Validators.required],
        Gender        : ['',Validators.required],
        ContentImg    : ['',Validators.required],
    });
    this.FileUploadForm = this._formBuilder.group({
      myfile        :['']


    });
    this.role = this.authService.getLoggedInUserDetails().roleId;
    this.username = this.authService.getLoggedInUserDetails().username;
  }

  ngOnInit(): void 
  {
  
    this.splashScreen.show();
    this.utilityApi.getAccountClass().subscribe(response => {
      console.log(response);
      if (response.code === 200) {
        this.accountType = response.data;
      }else {
        this.utilityApi.displayError('Unable to fetch account classes');
      }
      this.splashScreen.hide();
    },()=>{
      this.splashScreen.hide();
      this.utilityApi.displayError('Unable to fetch account classes');
    }); 
  }

  private _filter(value: string): void {
    this.filteredBranches = [];
    const filterValue = value.toString().toLowerCase();
    if(value !== '') {
      this.branches.forEach((branch)=> {
        if (branch.branchName.toLowerCase().includes(filterValue)) 
        {
          this.filteredBranches.push(branch);
        }
      });
    }else {
      this.branches.forEach((branch)=>this.filteredBranches.push(branch));
    }
  }

  uploadFileEvt(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      // michale added 
      this.broadcatsfile = imgFile.target.files[0];
      console.log(this.broadcatsfile);
      // michale added 
      this.frontFileAttr = '';
      Array.from(imgFile.target.files).forEach((file: any) => {
        this.frontFileAttr = file.name;
      });
      // HTML5 FileReader API
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        image.src = e.target.result;
        image.onload = (rs) => {
          this.selectedImage = e.target.result;
          this.isImageSelected = true;
        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);
      // Reset if duplicate image uploaded again
      this.fileInput.nativeElement.value = '';
    } else {
      this.frontFileAttr = 'Upload Front Image';
      this.isImageSelected = false;
    }
  }

  /* displayWithFilter (branch : any) :string
  {
    return branch ? `${branch.branchName}` : '';
  }

  sortBy(prop: string) {
    return this.filteredBranches.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  } */

  onFileSelect(event) {
    let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.broadcatsfile = file;
      console.log(this.broadcatsfile);
      // const file = event.target.files[0];
      // console.log(file);
      // if (!_.includes(af, file.type)) {
      //   this.utilityApi.displayFailed('Only EXCEL Docs Allowed!','File not allowed');
      // } else {
      //   this.broadcatsfile = file;
      //   //this.fileUploadForm.get('myfile').setValue(file);
      //   console.log(this.broadcatsfile);
      // }
    }
  }


  onFileSelectExcel(event) {
    let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      if (!_.includes(af, file.type)) {
        this.utilityApi.displayFailed('Only EXCEL Docs Allowed!','File not allowed');
      } else {
        this.customerListFileData = file;
        //this.fileUploadForm.get('myfile').setValue(file);
        console.log(this.customerListFileData);
      }
    }
  }




  createEmailBroadcast_2023_01_30(): void 
  {

    if (this.EmailBroadcastForm.valid) {
      let formData:any = new FormData();
      formData.set('file', this.broadcatsfile);
      formData.set('contactsFile', this.customerListFileData);
      formData.append('subject', this.EmailBroadcastForm.value.Subject);
      formData.append('broadcastDate', this.utilityApi.transformDate(this.EmailBroadcastForm.value.BroadcastDate,'dd/MM/yyyy'));
      // this.utilityApi.transformDate(this.SMSBroadcastForm.value.RunDate,'dd/MM/yyyy')
      // formData.append('RunTime', this.EmailBroadcastForm.value.RunTime);
      formData.append('RunTime', this.utilityApi.transformTime(this.EmailBroadcastForm.value.RunTime));
      formData.append('broadcastNow', this.EmailBroadcastForm.value.BroadcastNow);
      formData.append('accountType', this.EmailBroadcastForm.value.AccountType.accountClass);
      formData.append('religion', this.EmailBroadcastForm.value.Religion);
      formData.append('gender', this.EmailBroadcastForm.value.Gender);
      formData.append('contentImg', this.EmailBroadcastForm.value.ContentImg);
      // formData.append('broadcastDate', this.EmailBroadcastForm.value.BroadcastDate);
      formData.append('createdBy', this.EmailBroadcastForm.value.createdBy);





        const emailbroadcastdetails = {
          subject       : this.EmailBroadcastForm.value.Subject,
          broadcastDate : this.EmailBroadcastForm.value.BroadcastDate,
          RunTime       : this.EmailBroadcastForm.value.RunTime,
          broadcastNow  : this.EmailBroadcastForm.value.BroadcastNow,
          accountType   : this.EmailBroadcastForm.value.AccountType.accountClass,
          religion      : this.EmailBroadcastForm.value.Religion,
          gender        : this.EmailBroadcastForm.value.Gender,
          contentImg    : this.EmailBroadcastForm.value.ContentImg,
          createdBy     : this.username
      };
      console.log(formData);
      // return;
    
      const dialogRef = this.confirmationDialog.open({
        "title": "Emial Broadcast",
        "message": `Are you sure you want to  create the email broadcast  </br><span class="text-lg font-semibold">${this.EmailBroadcastForm.value.Subject} </span>?`,
        "icon": {
          "show": true,
          "name": "heroicons_outline:logout",
          "color": "success"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "submit",
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
              this.utilityApi.submitEmailBraodcast(formData).subscribe(response =>{
                this.splashScreen.hide();
                if (response.code === 200) {
                  this.utilityApi.displaySuccess('Email broadcast created successfully');
                }else {
                  this.utilityApi.displayFailed(response.message + ' Email broadcast failed, try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('Email broadcast failed to upload, server error.');
              });
            }
        });
  
  
  
  
    
    }

  }


  createEmailBroadcast(): void 
  {
    this.ValidatForm();

    if (this.EmailBroadcastForm.valid) {
      let formData:any = new FormData();
      formData.set('file', this.broadcatsfile);
      formData.append('isContactUpload',this.EmailBroadcastForm.value.Broadcastlist)
      formData.set('contactUploadFile', this.customerListFileData);
      formData.append('subject', this.EmailBroadcastForm.value.Subject);
      formData.append('broadcastDate', this.utilityApi.transformDate(this.EmailBroadcastForm.value.BroadcastDate,'dd/MM/yyyy'));
      // this.utilityApi.transformDate(this.SMSBroadcastForm.value.RunDate,'dd/MM/yyyy')
      // formData.append('RunTime', this.EmailBroadcastForm.value.RunTime);
      formData.append('RunTime', this.utilityApi.transformTime(this.EmailBroadcastForm.value.RunTime));
      formData.append('broadcastNow', this.EmailBroadcastForm.value.BroadcastNow);
      formData.append('accountType', this.EmailBroadcastForm.value.AccountType);
      formData.append('religion', this.EmailBroadcastForm.value.Religion);
      formData.append('gender', this.EmailBroadcastForm.value.Gender);
      formData.append('contentImg', this.EmailBroadcastForm.value.ContentImg);
      // formData.append('broadcastDate', this.EmailBroadcastForm.value.BroadcastDate);
      formData.append('createdBy', this.EmailBroadcastForm.value.createdBy);





        const emailbroadcastdetails = {
          subject       : this.EmailBroadcastForm.value.Subject,
          broadcastDate : this.EmailBroadcastForm.value.BroadcastDate,
          RunTime       : this.EmailBroadcastForm.value.RunTime,
          broadcastNow  : this.EmailBroadcastForm.value.BroadcastNow,
          accountType   : this.EmailBroadcastForm.value.AccountType.accountClass,
          religion      : this.EmailBroadcastForm.value.Religion,
          gender        : this.EmailBroadcastForm.value.Gender,
          contentImg    : this.EmailBroadcastForm.value.ContentImg,
          createdBy     : this.username
      };
      console.log(formData);
      // return;
    
      const dialogRef = this.confirmationDialog.open({
        "title": "Emial Broadcast",
        "message": `Are you sure you want to  create the email broadcast  </br><span class="text-lg font-semibold">${this.EmailBroadcastForm.value.Subject} </span>?`,
        "icon": {
          "show": true,
          "name": "heroicons_outline:logout",
          "color": "success"
        },
        "actions": {
          "confirm": {
            "show": true,
            "label": "submit",
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
              this.utilityApi.submitEmailBraodcast(formData).subscribe(response =>{
                this.splashScreen.hide();
                if (response.code === 200) {
                  this.utilityApi.displaySuccess('Email broadcast created successfully');
                }else {
                  this.utilityApi.displayFailed(response.message + ' Email broadcast failed, try again later.');
                }
              },()=>{
                this.splashScreen.hide();
                this.utilityApi.displayFailed('Email broadcast failed to upload, server error.');
              });
            }
        });
  
  
  
  
    
    }

  }

  ValidatForm():void
  {
    if(!this.EmailBroadcastForm.value.BroadcastNow)
      {
        console.log(this.EmailBroadcastForm.value.BroadcastNow);
        this.EmailBroadcastForm.get('BroadcastDate').setValidators(Validators.required);
        this.EmailBroadcastForm.get('RunTime').setValidators(Validators.required);
        this.EmailBroadcastForm.get('BroadcastDate').updateValueAndValidity();
        this.EmailBroadcastForm.get('RunTime').updateValueAndValidity();
       }
      else{
        console.log("checked")
        this.EmailBroadcastForm.get('BroadcastDate').clearValidators();
        this.EmailBroadcastForm.get('RunTime').clearValidators();      
        this.EmailBroadcastForm.get('BroadcastDate').updateValueAndValidity();
        this.EmailBroadcastForm.get('RunTime').updateValueAndValidity();
  
      }
  
      if (!this.EmailBroadcastForm.value.Broadcastlist)
      {
        console.log(this.EmailBroadcastForm.value.Broadcastlist);
        this.EmailBroadcastForm.get('AccountType').setValidators(Validators.required);
        this.EmailBroadcastForm.get('Religion').setValidators(Validators.required);
        this.EmailBroadcastForm.get('Gender').setValidators(Validators.required);
      
        this.EmailBroadcastForm.get('AccountType').updateValueAndValidity();
        this.EmailBroadcastForm.get('Religion').updateValueAndValidity();
        this.EmailBroadcastForm.get('Gender').updateValueAndValidity();
       }
      else{
  
        console.log("checked" + this.customerListFileData )
        this.EmailBroadcastForm.get('AccountType').clearValidators();
        this.EmailBroadcastForm.get('Religion').clearValidators();   
        this.EmailBroadcastForm.get('Gender').clearValidators();
      
        this.EmailBroadcastForm.get('AccountType').updateValueAndValidity();
        this.EmailBroadcastForm.get('Religion').updateValueAndValidity();
        this.EmailBroadcastForm.get('Gender').updateValueAndValidity();
      
      }
  
  
  
  }
    






}
