import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilityService } from 'app/shared/services/utility.service';
import moment from 'moment';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-broadcast-sms-report',
  templateUrl: './broadcast.sms.component.html',
  styleUrls: ['./broadcast.sms.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class SmsBroadcastReport implements OnInit {

  
  braodcastsmsRecord: any[] = [];
  broadcastData: any;
  reportfilter: FormGroup;
  displayedColumns: string[] = ['message','subject','broadcastDate','broadcastTime','accountType','religion','gender','status'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = false;
  isResultEmpty:boolean = false;
  transactions: any[] = [];
  today = new Date();


  
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
  ) {
    
    this.reportfilter = this._formBuilder.group({
      // StartDate  : [new FormControl(moment({year: this.today.getFullYear(), month: this.today.getMonth(), date: this.today.getDate()})),Validators.required],
      StartDate  : ['',Validators.required],
      EndDate    : ['',Validators.required],
      Status     : ['',Validators.required]
    });
   }

  ngOnInit(): void {
    
  }


  /* private _filter(value: string): void {
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
  } */

  /* displayWithFilter (branch : any) :string
  {
    return branch ? `${branch.branchName}` : '';
  }

  sortBy(prop: string) {
    return this.filteredBranches.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  } */
  featchBroadcastReport(): void 
  {
    if (this.reportfilter.valid) {
      console.log((this.reportfilter.value.StartDate._i['month']+1));
      let startdate = String(this.reportfilter.value.StartDate._i['date']).padStart(2, "0") + '/' + String(this.reportfilter.value.StartDate._i['month']+1).padStart(2, "0") + '/' + this.reportfilter.value.StartDate._i['year']
      let enddate   = String(this.reportfilter.value.EndDate._i['date']).padStart(2, "0") + '/' +   String(this.reportfilter.value.EndDate._i['month'] +1).padStart(2, "0") + '/'  + this.reportfilter.value.EndDate._i['year']
      // '2'.padStart(2, "0");
      const queryData = {
        fromDate        : startdate,
        toDate          : enddate, //this.reportfilter.value.EndDate,
        status          : this.reportfilter.value.Status,
      
      };
      console.log(queryData);
      this.isLoading = true;
      this.utilityApi.getBroadcastReport(queryData).subscribe((response: any) => {
      console.log(response);
      if (response.code === 200) {
        console.log('got the data'+ response.data);
        this.braodcastsmsRecord = response.data;
        this.dataSource = new MatTableDataSource(this.braodcastsmsRecord);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
        this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
        if (this.braodcastsmsRecord.length === 0) {
          this.isResultEmpty = true;
        }
      }else {
        this.isLoading = false;
        this.utilityApi.displayFailed(response.errMsg);
      }  
    },()=> {
          this.isLoading = false;
          this.utilityApi.displayError('Unable to fetch unauthorized customers');
          this.renderer.removeClass(this.tableDivView.nativeElement,'hidden');
    });
  }

  }












  createUser(): void 
  {
    if (this.reportfilter.valid) {
      const queryData = {
        status        : this.reportfilter.value.Firstname,
        fromDate      : this.reportfilter.value.Email,
        toDate        : this.reportfilter.value.Branch.branchCode,
       
      };
      this.splashScreen.show();
      this.utilityApi.createAdbUser(JSON.stringify(queryData)).subscribe(response => {
        this.splashScreen.hide();
        if (response.errCode === 0) {
            // display the data in the table
        }else {
            this.utilityApi.displayFailed(response.errMsg +"Error occur while fetching data");
        }
      },() => {
        this.splashScreen.hide();
        this.utilityApi.displayFailed('Network / Server Error!');
      });
    }
      // };


    /* this.dialogRef = this._matDialog.open(ConfirmUserDetailsComponent,{
        data: {
          userDetails : this.CreateUserForm.value
        },
        width : '500px',
        disableClose: false
    }); */

    /* this.dialogRef.afterClosed().subscribe((result)=>{
      
      if(result === true) {
        this.splashScreen.show();
        this.utilityApi.createAdbUser(JSON.stringify(userData)).subscribe(response => {
          this.splashScreen.hide();
          if (response.errCode === 0) {
            this.utilityApi.displaySuccessRedirect('User '+this.CreateUserForm.value.Firstname+ ' was successfully created.', '/xmobileadmin/user-management/users');
          }else {
            this.utilityApi.displayFailed(response.errMsg);
          }
        },() => {
            this.splashScreen.hide();
            this.utilityApi.displayFailed('Network / Server Error!');
          });
        }
      }); */
    
    }
  

  // authorizeBroadContact() : void 
  // {
  //   if(this.CreateUserForm.valid==true)
  //   {
  //     const dialogRef = this.confirmationDialog.open({
  //       "title": "Upload broadcast Contact",
  //       "message": `Are you sure you want to upload broadcast contact`,
  //       "icon": {
  //         "show": true,
  //         "name": "mat_outline:library_add_check",
  //         "color": "info"
  //       },
  //       "actions": {
  //         "confirm": {
  //           "show": true,
  //           "label": "Submit",
  //           "color": "accent"
  //         },
  //         "cancel": {
  //           "show": true,
  //           "label": "Cancel"
  //         }
  //       },
  //       "dismissible": true
  //     });

  //       dialogRef.afterClosed().subscribe((result) => {
  //           if (result === 'confirmed') {
  //             this.splashScreen.show();
  //             const contacct = {
  //               fullName: this.CreateUserForm.value.FullName,
  //               emailAddress: this.CreateUserForm.value.Email,
  //               phoneNumber: this.CreateUserForm.value.Mobile,
  //               broadcastSms: this.CreateUserForm.value.SMSAlert,
  //               broadcastEmail: this.CreateUserForm.value.EmailAlert,
  //               guid: "",
  //               customerExist: "",
  //               gender: this.CreateUserForm.value.Gender,
  //               religion: this.CreateUserForm.value.Religion,
  //               accountType: this.CreateUserForm.value.AccountType
                
  //             };
  //             this.utilityApi.registerBroadcastContact(JSON.stringify(contacct)).subscribe(response =>{
  //               this.splashScreen.hide();
  //               if (response.code === 200) {
  //                 this.utilityApi.displaySuccess('Contact uploaded successfully');
  //               }else {
  //                 this.utilityApi.displayFailed('Contact uploaded failed try again later.');
  //               }
  //             },()=>{
  //               this.splashScreen.hide();
  //               this.utilityApi.displayFailed('Contact uploaded process failed, server error.');
  //             });
  //           }
  //       });
  //   }
  //  }


}
