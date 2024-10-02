import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppApiUrlsService } from './app-api-urls.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertDialogService } from './alerts/alert-dialog.service';
import { DatePipe } from '@angular/common';
import { pad } from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(
    private http: HttpClient, 
    private snackBar: MatSnackBar,
    private alertService: AlertDialogService,
    private datePipe: DatePipe,
    ) { }



  getCustomerInfoByAcctNo(accNto: string) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.REG_CUSTOMER + `/${accNto}`);
  }

  verifyCustomerAccount(accountData: any) : Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.GET_CUSTOMER,accountData);
  }

  fetchRegesteredAccDetails(accountData: any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GET_REG_ACC_DET+ `/${accountData}`);
  }


  fetchRegesteredAccNumber(accountData: any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GET_REG_ACC_DET_BY_AC_NUM+ `/${accountData}`);
  }

  fetchRegAndEditedAcctDetails(accountData: any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GET_REG_EDIT_ACC_DET_BY_AC_NUM+ `/${accountData}`);
  }

  fetchRegAndEditedCustDetails(custNo: any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GET_REG_EDIT_ACC_DET_BY_CUST_NO+ `/${custNo}`);
  }


  fetchRegesteredCusDetailsbycustid(custid: any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GET_REG_CUST_DET+ `/${custid}`);
  }

  fetchUpdateCusDetailsbycustid(custid: any,accounnt:any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GET_UPDATE_CUST+ `?custId=${custid}&accNo=${accounnt}`);
  }
  // GET_UPDATE_CUST

  submitBulkCustomer(fileData: any) : Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.REG_CUSTOMER_BULK,fileData);
  }

  submitBulkContactUpload(fileData: any) : Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.CONTACT_BULK_UPLOAD,fileData);
  }

  createCustomer(customerData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.REG_CUSTOMER, customerData);
  }

  omniupdateCustomer(customerData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.UPDATE_CUSTOMER, customerData);
  }

  omniupdateAccount(customerData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.UPDATE_ACCOUNT, customerData);
  }

  createCustomerBulk(customerData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.REG_CUSTOMER_bulk, customerData);
  }

  exemptCustomerBulk(customerData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.EXEMPT_CUST_bulk, customerData);
  }


  authorizeBankUser(payload: any): Observable<any>
  {
    console.log('payload', payload)
    return this.http.post<any>(AppApiUrlsService.AUTHORIZE_BANK_USER, payload);
  }

  getDepartments() : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.DEPARTMENTS);
  }

  createDepartment(departmentData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.CREATE_DEPARTMENT, departmentData);
  }

  removeDepartment(departmentData: any): Observable<any> 
  {
    console.log(departmentData);
    return this.http.delete<any>(AppApiUrlsService.DELETE_DEPARTMENTS+ `/${departmentData.id}`);
  }











  getWidgetStatistics() : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.DASHBOARD_STATS);
  }

  getDashboardWidgetTotalCustomer() : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.DASH_TOT_CUST);
  }

  getDashboardWidgetTotalCustomerByStatus(status : string) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.DASH_CUST_STA+`/${status}`);
  }

  getDashboardWidgetTotalLockedCustomer(status : string) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.DASH_LOCK_CUST+`/${status}`);
  }

  getDashboardWidgetTotalTransaction() : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.DASH_TOTAL_TXN);
  }

  getDashboardWidgetTotalTransactionByStatus(status : string) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.DASH_TXN_BY_STA+`/${status}`);
  }

  getDashboardWidgetTotalSms() : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.DASH_TOTAL_SMS);
  }

  getBranches() : Observable<any> 
  {
    return this.http.get(AppApiUrlsService.USER_BRANCHES);

  }


  getAccountClass() : Observable<any> 
  {
    return this.http.get(AppApiUrlsService.getAccountClass);

  }

  getRoles() : Observable<any> 
  {
    return this.http.get(AppApiUrlsService.USER_ROLES);

  }

  getCollections() : Observable<any> 
  {
    return this.http.get(AppApiUrlsService.COLLECTIONS);
  }

  createAdbUser(userData : any) : Observable<any> 
  {
    return this.http.post(AppApiUrlsService.CREATE_USER,userData);
  }  

  createAppUser(userData : any) : Observable<any> 
  {
    return this.http.post(AppApiUrlsService.CREATE_USER,userData);
  }  
  // CREATE_USER
  adValidation(userData : any) : Observable<any> 
  {
    return this.http.get(AppApiUrlsService.AD_USER_VALIDATION + `/${userData}` );
  }

  getAdbUserByStatus(status: string, branch: string) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GET_USERS + `/${status}/${branch}`);
  }

  updateAdbUserStatus(userData : any) : Observable<any> 
  {
    return this.http.put<any>(AppApiUrlsService.UPDATE_USER_STAT,userData);
  }

  updateAdbUser(userData: any): Observable<any> 
  {
    return this.http.put<any>(AppApiUrlsService.UPDATE_USER, userData);
  }

  updateUser(userData: any): Observable<any> 
  {
    return this.http.put<any>(AppApiUrlsService.UPDATE_USER +`/${userData.id}`,userData );
  }

  authorizeUser(userData : any) : Observable<any> 
  {
    return this.http.put<any>(AppApiUrlsService.AUTHORIZE_USER,userData);
  }

  updateLockedUserStatus(userData : any) : Observable<any> 
  {
    return this.http.put<any>(AppApiUrlsService.LOCK_USER,userData);
  }

  resetUserPassword(userData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.RESET_USER_PASS, userData);
  }

  userDeactivate(userData: any): Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.DEACTIVATE_USER + `/${userData}`);
  }

  userActivate(userData: any): Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.ACTIVATE_USER + `/${userData}`);
  }

  submitEmailBraodcast(fileData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.EMAIL_BROADCAST,fileData);
    // return this.http.get<any>(AppApiUrlsService.ACTIVATE_USER + `/${userData}`);
  }

  getCollectionUsers() : Observable<any> 
  {
    return this.http.get(AppApiUrlsService.GET_COL_USERS);
  }

  createCollectionUser(userData : any) : Observable<any> 
  {
    return this.http.post(AppApiUrlsService.CREATE_COL_USER,userData);
  } 

  updateCollectionUser(userData : any) : Observable<any> 
  {
    return this.http.put(AppApiUrlsService.EDIT_COLL_USER,userData);
  }
  
  updateCollectionUserStatus(userData : any) : Observable<any> 
  {
    return this.http.put(AppApiUrlsService.UPDT_COLL_USER,userData);
  }

  resetCollectionUserPassword(userData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.RESET_COLL_USER, userData);
  }

  getAllDeactivatedCustomers(branch : string) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.DEACTIVATED_CUST + `/${branch}`);
  }

  getAllActiveCustomers(branch : string) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.ACTIVE_CUST + `/${branch}`);
  }

  getCustomersByAuthStat(status : string,branch : string) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GET_CUST_BY_AUTH + `/${status}/${branch}`);
  }

  getCustomersNonAuth(status : string,branch : string) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GET_CUST_UN_AUTH );//+ `?branchId=/${branch}`);
  }

  getAppCharge(chargeType:any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GET_APP_CHARGE,chargeType);
  }

  getBroadcastReport(filterDetails:any) : Observable<any> 
  {
    console.log(filterDetails);
    return this.http.get<any>(AppApiUrlsService.GET_BROADCAST_SMS,filterDetails);
  }

  getCharges(ChargeDesc: string) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GET_CHARGE_AMOUNT  + `/${ChargeDesc}` );
  }

  processCharges(ChargeData : any) : Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.PRO_CHRG, ChargeData);
  }

  setChargeConfig(ChargeData : any) : Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.CHRG_CONFIG, ChargeData);
  }

  getChargeConfig() : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GET_CHRG_CONFIG);
  }

  sendSMSBroadcast(broadcastData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.SMS_BROADCAST, broadcastData);
  }

  getUnauthorizedSMSBroadcasts() : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.AUTH_BROADCAST);
  }

  getUnauthorizedEmailBroadcasts() : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.EMAIL_AUTH_BROADCAST);
  }

  authoriseSMSBroadcast(broadcastData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.AUTH_SMS_BRODT, broadcastData);
  }

  registerBroadcastContact(broadcastData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.REG_BROD_CONTACT, broadcastData);
  }


  getActivityReportByDate(queryParam: any) : Observable<any>
  {
    return this.http.get<any>(AppApiUrlsService.ACTIVITY_REPORT, {params: queryParam})
  }

  getAlertSummaryReport(queryParam: any) : Observable<any>
  {
    return this.http.get<any>(AppApiUrlsService.ALERT_SUMMARY_REPORT, {params: queryParam})
  }

  authoriseEmailBroadcast(broadcastData: any): Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.AUTH_EMAIL_BRODT+`/${broadcastData}/authorize`);
  }

  getTransactionCodes() : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.ALL_TRANSACTION_CODES);
  }
  
  addTransactionCodeExemption(transCodeData : any) : Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.add_Tran_Code_Exemption,transCodeData);
  }

  removeTransactionCodeExemption(transCodeData : any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.remove_Tran_Code_Exemption+ `/${transCodeData}` +'/remove');
  }

  searchAllRegCustomer(searchData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.getAllRegCustomer, searchData);
  }

  getLockedCustomers(branch : string) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.LOCK_CUST + `/${branch}`);
  }

  getAllCustomers(branchId: string) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.ALL_CUST + `/${branchId}`);
  }
  GET_ALL_CUST() : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GET_ALL_CUST);
  }

  GET_ALL_ACCOUNTS(payload: any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GET_ALL_ACCOUNTS, {params: payload});
  }

  GET_EXEMPTED_CUST() : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GET_EXEMP_CUST);
  }

  getCustomersAccount(userId : string) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GET_CUST_ACCT + `/${userId}`);
  }

  getAdbUsersByAuthStat(status : string,branch : string) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.AUTH_USERS + `/${status}/${branch}`);
  }

  getUnAuthUsers() : Observable<any> 
  {
    // return this.http.get<any>(AppApiUrlsService.UN_AUTH_USERS + `/${status}/${branch}`);
    return this.http.get<any>(AppApiUrlsService.UN_AUTH_USERS);
  }

  getAdbUsersByLockedStat(status : string,branch : string) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.LOCKED_USERS + `/${status}/${branch}`);
  }

  getAllAdbUsers(branchId: string) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.ALL_USERS + `/${branchId}`);
  }
  getAllAppUsers(branchId: string) : Observable<any> 
  {
    // return this.http.get<any>(AppApiUrlsService.GET_USER_BY_STATUS + `/${branchId}`);
    return this.http.get<any>(AppApiUrlsService.GET_USER_BY_STATUS);
  }

  getMonths(): Observable<any> {
    return this.http.get(AppApiUrlsService.GET_MONTHS);
  }

  getYears(): Observable<any> {
    return this.http.get(AppApiUrlsService.GET_YEARS);
  }

  getChequeBookRequests() : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.CHQBK_REQ);
  }

  updateChequebookRequest(refId:string, acctNum: string, status: string): Observable<any> 
  {
    return this.http.put<any>(AppApiUrlsService.UPDT_CHQBK_REQ + `/${refId}/${acctNum}/${status}`, null);
  }

  getCustomersComplaints() : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.CUST_COMPLAINT);
  }

  updateCustomerStatus(customerData : any) : Observable<any> 
  {
    return this.http.put<any>(AppApiUrlsService.UPDATE_CUST,customerData);
  }

  markComplaintAsResolved(refNo : any) : Observable<any> 
  {
    return this.http.put<any>(AppApiUrlsService.RESOLV_COMPLAINT + `/${refNo}`,null);
  }

  authorizeCustomer(customerData : any) : Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.AUTHORIZE_CUST,customerData);
  }


  SendStatement(customerData : any) : Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.GENERATE_CUST_STATAEMENT,customerData);
  }


  createSmsbraodcast(customerData : any) : Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.SMS_BRAODCAST,customerData);
  }




  unlockCustomer(status : any, userId : string) : Observable<any>
  {
    return this.http.put(AppApiUrlsService.UNLOCK_CUST + `/${userId}/${status}`,null);
  }

  deleteCustomerById(userId: string, admin: any) : Observable<any> 
  {
    return this.http.delete<any>(AppApiUrlsService.DEL_CUST + `/${userId}`,{body: admin});
  }

  unregisterCustomerById(userId: string, admin: any) : Observable<any> 
  {
    return this.http.delete<any>(AppApiUrlsService.UN_REG_CUSTOMER + `/${userId}`,{body: admin});
  }


  unregisterCustomer(customerData: any) : Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.UN_REG_CUSTOMER, customerData);
  }
  


  resetCustomerPassword(customerData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.RESET_PASS, customerData);
  }

  

  

  updateCustomer(customerData: any): Observable<any> 
  {
    return this.http.put<any>(AppApiUrlsService.EDIT_CUST, customerData);
  }

  findAccountsById(custId: string) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.FETCH_ACC + `/${custId}`);
  }

  saveCustomerAccounts(accountData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.CUST_ACCOUNT, accountData);
  }

  unlinkCustomerAccount(accountData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.DEL_CUST_ACCT, accountData);
  }

  changeAdminPassword(adminPasswordData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.CHANNGE_PASS, adminPasswordData);
  }

  getTransactionByDate(transactionFilter: any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.TRNX_REPORT,{params : transactionFilter});
  }

  getSubscribersByDate(dateFilter: any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.SUBSCBR_REPORT,{params : dateFilter});
  }

  exportSubscribersData(dateFilter: any) : Observable<any> 
  {
    return this.http.request<any>('GET',AppApiUrlsService.EXP_SUBR_REPORT,
      {
        params : dateFilter,
        responseType : 'blob' as 'json'
      });
  }

  exportSubscribersByBranchData(dateFilter: any) : Observable<any> 
  {
    return this.http.request<any>('GET',AppApiUrlsService.EXP_SUB_BR_REPORT,
      {
        params : dateFilter,
        responseType : 'blob' as 'json'
      });
  }

  getGIPReports() : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GIP_REPORT);
  }

  getGIPTransactionsByDate(transactionFilter: any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GIP_REPORT_DATE,{params : transactionFilter});
  }

  getOTPReports() : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.OTP_REPORT);
  }

  getOTPReportByFilter(otpFilter: any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.OTP_REPORT_FILTER,{params : otpFilter});
  }

  getSMSReports() : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.SMS_REPORT);
  }


  getSMSTransactionReports(queryData :any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.SMS_TRAS_REPORT,{params:queryData});
  }

  getBirthdaySmsReports(queryData :any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.BIRTHDAY_SMS_REPORT,{params:queryData});
  }

  getBirthdayEmailReports(queryData :any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.BIRTHDAY_EMAIL_REPORT,{params:queryData});
  }

  getNewAccountOpeningSmsReports(queryData :any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.NEW_ACCOUNT_OPENING_SMS_REPORT,{params:queryData});
  }

  getNewAccountOpeningEmailReports(queryData :any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.NEW_ACCOUNT_OPENING_EMAIL_REPORT,{params:queryData});
  }

  getEmailTransactionReports(queryData :any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.EMAIL_TRAS_REPORT,{params:queryData});
  }

  getChargeTransactionReports(queryData :any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.CRG_TRAS_REPORT,{params:queryData});
  }
  


  getSmsReportByFilter(smsFilter: any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.SMS_REPORT_SRCH,{params : smsFilter});
  }

  getEmailReports() : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.EMAIL_REPORT);
  }

  getEmailReportByFilter(emailFilter: any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.EMAIL_REPORT_SRH,{params : emailFilter});
  }

  getExpressPayTransactions(transactionFilter: any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.EXPRESS_REPORT,{params : transactionFilter});
  }

  exportExpressPayTransactions(dateFilter: any) : Observable<any> 
  {
    return this.http.request<any>('GET',AppApiUrlsService.EXP_EXPR_REPORT,
      {
        params : dateFilter,
        responseType : 'blob' as 'json'
      });
  }

  getAdminActivityLogs(logFilter: any) : Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.ACTIVITY_LOG,{params : logFilter});
  }

  searchCustomerByStatus(searchData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.SRCH_CUST_STAT, searchData);
  }

  searchCustomerByAuthorization(searchData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.SRCH_AUTH_CUST, searchData);
  }


  searchCustomerForStatement(searchData: any): Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GET_STATAEMENT_RECORD, {params :searchData});
  }

  fetchCustomerForStatePrintout(CustId: any): Observable<any> 
  {
    return this.http.get<any>(AppApiUrlsService.GET_CUST_DETAILS_STATE + `/${CustId}`);
  }


  searchCustomerByLockedStatus(searchData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.SRCH_LOCK_CUST, searchData);
  }

  searchAllCustomer(searchData: any): Observable<any> 
  {
    return this.http.post<any>(AppApiUrlsService.SRCH_ALL_CUST, searchData);
  }

  
  displaySuccess(message : string): void 
  {  
  
        this.alertService.openSuccess({
          title: 'Completed Successfully',
          message : message,
          dismissible : false
        });

  }

  displaySuccessRedirect(message : string, redirectLink: string): void 
  { 
  
         this.alertService.openSuccess({
          title: 'Completed Successfully',
          message : message,
          dismissible : false,
          actions    : {
              confirm: {
                  show : false
              },
              confirmRedirect : {
                  show : true,
                  link: redirectLink
              }
          },
         });
  }

  displaySuccessNoReload(message : string): void 
  {
      
          this.alertService.openSuccess({
            title: 'Completed Successfully',
            message : message,
            dismissible : false,
            actions    : {
                confirm: {
                    show : false
                },
                confirmNoReload : {
                    show : true
                }
            },
           });
  }


  displayCustomNotificate(title:string,message : string): void 
  {
      
          this.alertService.openSuccess({
            title: title,
            message : message,
            dismissible : false,
            actions    : {
                confirm: {
                    show : false
                },
                confirmNoReload : {
                    show : true
                }
            },
           });
  }



  displayFailed(message : string, title? : string): void 
  {
        title = title == undefined ? 'Process Failed.': title; 
        this.alertService.openFailed({
          title : title,
          message : message
        });
  }


  


  displayError(errorText? : string): void 
  {
    errorText = errorText == undefined ? 'Network / Server Error occurred': errorText;
    this.snackBar.open(errorText,'Close',{duration:5000,verticalPosition: 'top',horizontalPosition: 'end'});
  }

  transformDate(date : any, format? : string) : string
  {
    format = format == undefined ? 'yyyy-MM-dd': format;
    return this.datePipe.transform(date, format);
  }

  transformTime(time : any) : string
  {
    // let currentHours = time.getHours();
  //  time = ("0" + currentHours).slice(-2);
   let newTime = time.split(':');
   let timeHour = newTime[0].length < 2 ? pad("0" + newTime[0], 2) : newTime[0]; 
   time = String(timeHour) +':'+ String(newTime[1])
  return time;
  }

}
