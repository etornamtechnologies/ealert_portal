import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { UtilityService } from 'app/shared/services/utility.service';

@Component({
  selector: 'app-activity-history',
  templateUrl: './activity-history.component.html',
  styleUrls: ['./activity-history.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ActivityHistoryComponent implements OnInit {

  historyFilter: FormGroup;
  displayedColumns: string[] = ['user_id','action','entity','status','timestamp'];
  dataSource: MatTableDataSource<any>;
  isLoading:boolean = false;
  isResultEmpty:boolean = false;
  history: any[] = [];
  selectedUserId:string = '';
  selectedActivityDate:string = '';
  users: any[] = [];
  userBranch: string;
  filteredUsers: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("TableContainer") tableDivView: ElementRef;

  constructor(
    private utilityApi: UtilityService,
    private renderer: Renderer2,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private splashScreen: FuseSplashScreenService
  ) {
      this.historyFilter = this._formBuilder.group({
        ActivityDate  : '',
        AdbUser       : ''
      });
      this.userBranch = this.authService.getLoggedInUserDetails().branch;
  }

  ngOnInit(): void 
  {
    this.dataSource = new MatTableDataSource(this.history);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.splashScreen.show();
    this.getUsers(this.userBranch).then(response => {
      if (response.errCode === 0) {
        this.users = response.data.users;
        this.users.forEach((user)=>this.filteredUsers.push(user));
        this.historyFilter.get('AdbUser').valueChanges.subscribe((value)=>this._filter(value));
      }else {
        this.utilityApi.displayError(response.errMsg);
      } 
      this.splashScreen.hide();
    },()=> {
          this.splashScreen.hide();
          this.utilityApi.displayError('Unable to fetch adb users');
    });
    
  }

  private _filter(value: string): void {
    this.filteredUsers = [];
    const filterValue = value.toString().toLowerCase();
    if(value !== '') {
      this.users.forEach((user)=> {
        const searchComboText = `${user.fname} ${user.lname} ${user.username}`
        if (searchComboText.toLowerCase().includes(filterValue)) 
        {
          this.filteredUsers.push(user);
        }
      });
    }else {
      this.users.forEach((user)=>this.filteredUsers.push(user));
    }
  }

  displayWithFilter (user : any) :string
  {
    return user ? `${user.fname} ${user.lname}` : '';
  }

  sortBy(prop: string) {
    return this.filteredUsers.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  }

  getActivityHistoryResult(): void 
  {
    if(this.historyFilter.valid) {
      if(this.historyFilter.value.AdbUser === '' && this.historyFilter.value.ActivityDate === ''){
        this.utilityApi.displayError('Please select at least one activity filter to continue');
        return;
      }
      this.isLoading = true;
      this.renderer.addClass(this.tableDivView.nativeElement,'hidden');
      if(this.historyFilter.value.AdbUser !== ''){
        this.selectedUserId = this.historyFilter.value.AdbUser.username;
      }
      if(this.historyFilter.value.ActivityDate !== ''){
        this.selectedActivityDate = this.utilityApi.transformDate(this.historyFilter.value.ActivityDate._d,'dd-MMM-yy').toUpperCase();
      }
      this.isResultEmpty = false;
      const transactionParam = {
        userId         : this.selectedUserId,
        activityDate   : this.selectedActivityDate
      };
      this.utilityApi.getAdminActivityLogs(transactionParam).subscribe(response => {
        if (response.errCode === 0) {
          this.history = response.data.activities;
          this.dataSource = new MatTableDataSource(this.history);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (this.history.length === 0) {
            this.isResultEmpty = true;
          }
        }else {
          this.utilityApi.displayError(response.errMsg);
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

  getUsers(branch : string) : Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.utilityApi.getAllAdbUsers(branch)
          .subscribe((response: any) => {
            resolve(response);
          },()=> {
            reject();
          });
    });
  }

}
