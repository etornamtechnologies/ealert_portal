import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApexOptions } from 'ng-apexcharts';
import { ProjectService } from 'app/modules/admin/dashboard/project.service';
import { UtilityService } from 'app/shared/services/utility.service';
import { fuseAnimations } from '@fuse/animations';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class DashboardComponent implements OnInit, OnDestroy {

    chartGithubIssues: ApexOptions = {};
    data: any;
    totalCustomer: any;
    totalActiveCustomer: any;
    totalBlockedCustomer: any;
    totalLockedCustomer: any;
    totalTransactions: any;
    totalSuccessfulTransactions: any;
    totalFailedTransactions: any;
    totalSms: any;

    totalEmailNotification :any;
    totalSuccessfulEmailNotification: any;
    totalFailedEmailNotification:any;
    totalPendingEmailNotification:any;
    totalSMSNotification :any;
    totalSuccessfulSMSNotification: any;
    totalFailedSMSNotification:any;
    totalPendingSMSNotification:any;

    isLoadingTotalCustomer: boolean = true;
    isLoadingTotalActiveCustomer: boolean = true;
    isLoadingTotalBlockedCustomer: boolean = true;
    isLoadingTotalLockedCustomer: boolean = true;
    isLoadingTotalTransactions: boolean = true;
    isLoadingTotalSuccessfulTransactions: boolean = true;
    isLoadingTotalFailedTransactions: boolean = true;
    isLoadingTotalSms: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private utilityApi: UtilityService,
        private _projectService: ProjectService,
        private _router: Router
    )
    {
    }

    ngOnInit(): void
    {

        this.utilityApi.getDashboardWidgetTotalCustomer().subscribe(response=>{
            if (response.code == 200){
                this.totalCustomer = response.data.customerCount;
                this.isLoadingTotalCustomer = false;
                // ====================================
                this.totalActiveCustomer = response.data.activeCustomerCount;
                this.isLoadingTotalActiveCustomer = false;
                // ======================================
                this.totalBlockedCustomer = response.data.allAccountsCount;
                this.isLoadingTotalBlockedCustomer = false;
                // =====================================
                this.totalLockedCustomer = response.data.activeAccountsCount;
                this.isLoadingTotalLockedCustomer = false;
                // ======================================
                this.totalTransactions = (response.data.allSmsTransactionAlertCount+response.data.allEmailTransactionAlertCount);
                this.isLoadingTotalTransactions = false;
                // =====================================
                this.totalSuccessfulTransactions = (response.data.sentEmailTransactionAlertCount+response.data.sentSmsTransactionAlertCount);
                this.isLoadingTotalSuccessfulTransactions = false;
                // =====================================
                this.totalFailedTransactions = (response.data.failedEmailTransactionAlertCount + response.data.failedSmsTransactionAlertCount) ;
                this.isLoadingTotalFailedTransactions = false;
                // =======================================
                this.totalSms = (response.data.pendingEmailTransactionAlertCount + response.data.pendingSmsTransactionAlertCount);
                this.isLoadingTotalSms = false;
                // ==================================

                this.totalEmailNotification = response.data.allEmailTransactionAlertCount;
                this.totalSuccessfulEmailNotification = response.data.sentEmailTransactionAlertCount;
                this.totalFailedEmailNotification = response.data.failedEmailTransactionAlertCount;
                this.totalPendingEmailNotification = response.data.pendingEmailTransactionAlertCount;
                // =============================
                this.totalSMSNotification = response.data.allSmsTransactionAlertCount;
                this.totalSuccessfulSMSNotification = response.data.sentSmsTransactionAlertCount;
                this.totalFailedSMSNotification = response.data.failedSmsTransactionAlertCount;
                this.totalPendingSMSNotification = response.data.pendingSmsTransactionAlertCount;



            }
        },()=>(this.isLoadingTotalCustomer = false,this.isLoadingTotalActiveCustomer = false,this.isLoadingTotalBlockedCustomer = false,this.isLoadingTotalLockedCustomer = false,
            this.isLoadingTotalTransactions = false,this.isLoadingTotalSuccessfulTransactions = false,this.isLoadingTotalFailedTransactions = false,this.isLoadingTotalSms = false));

        // this.utilityApi.getDashboardWidgetTotalCustomerByStatus('A').subscribe(response=>{
        //     this.totalActiveCustomer = response.data.customer;
        //     this.isLoadingTotalActiveCustomer = false;
        // },()=>this.isLoadingTotalActiveCustomer = false);

        // this.utilityApi.getDashboardWidgetTotalCustomerByStatus('D').subscribe(response=>{
        //     this.totalBlockedCustomer = response.data.customer;
        //     this.isLoadingTotalBlockedCustomer = false;
        // },()=>this.isLoadingTotalBlockedCustomer = false);

        // this.utilityApi.getDashboardWidgetTotalLockedCustomer('Y').subscribe(response=>{
        //     this.totalLockedCustomer = response.data.customer;
        //     this.isLoadingTotalLockedCustomer = false;
        // },()=>this.isLoadingTotalLockedCustomer = false);

        // this.utilityApi.getDashboardWidgetTotalTransaction().subscribe(response=>{
        //     this.totalTransactions = response.data.transaction;
        //     this.isLoadingTotalTransactions = false;
        // },()=>this.isLoadingTotalTransactions = false);

        // this.utilityApi.getDashboardWidgetTotalTransactionByStatus('S').subscribe(response=>{
        //     this.totalSuccessfulTransactions = response.data.transaction;
        //     this.isLoadingTotalSuccessfulTransactions = false;
        // },()=>this.isLoadingTotalSuccessfulTransactions = false);

        // this.utilityApi.getDashboardWidgetTotalTransactionByStatus('F').subscribe(response=>{
        //     this.totalFailedTransactions = response.data.transaction;
        //     this.isLoadingTotalFailedTransactions = false;
        // },()=>this.isLoadingTotalFailedTransactions = false);

        // this.utilityApi.getDashboardWidgetTotalSms().subscribe(response=>{
        //     this.totalSms = response.data.sms;
        //     this.isLoadingTotalSms = false;
        // },()=>this.isLoadingTotalSms = false);

        // Get the data
        this._projectService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {

                // Store the data
                this.data = data;

                // Prepare the chart data
                this._prepareChartData();
            });

        // Attach SVG fill fixer to all ApexCharts
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    }
                }
            }
        };
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void
    {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
             .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
             .forEach((el) => {
                 const attrVal = el.getAttribute('fill');
                 el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
             });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void
    {
        // Github issues
        this.chartGithubIssues = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                toolbar   : {
                    show: false
                },
                zoom      : {
                    enabled: false
                }
            },
            colors     : ['#64748B', '#94A3B8'],
            dataLabels : {
                enabled        : true,
                enabledOnSeries: [0],
                background     : {
                    borderWidth: 0
                }
            },
            grid       : {
                borderColor: 'var(--fuse-border)'
            },
            labels     : this.data.githubIssues.labels,
            legend     : {
                show: false
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },
            series     : this.data.githubIssues.series,
            states     : {
                hover: {
                    filter: {
                        type : 'darken',
                        value: 0.75
                    }
                }
            },
            stroke     : {
                width: [3, 0]
            },
            tooltip    : {
                followCursor: true,
                theme       : 'dark'
            },
            xaxis      : {
                axisBorder: {
                    show: false
                },
                axisTicks : {
                    color: 'var(--fuse-border)'
                },
                labels    : {
                    style: {
                        colors: 'var(--fuse-text-secondary)'
                    }
                },
                tooltip   : {
                    enabled: false
                }
            },
            yaxis      : {
                labels: {
                    offsetX: -16,
                    style  : {
                        colors: 'var(--fuse-text-secondary)'
                    }
                }
            }
        };

    }

}
