/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';
import { AppStore } from 'app/shared/localstorage-helper';
import Swal from 'sweetalert2';

const appStore = JSON.parse(AppStore.get('currentUser'));
console.log(appStore);
let menu:FuseNavigationItem = {
    id: 'menus',
    title: '',
    type     : 'group',
    children : []
};

if (appStore !== null)
{
    if (appStore.branch === '000')
    {
        if(appStore.roleId.toUpperCase() === 'ALLROLES') 
        {
            menu = {
                id: 'menus',
                title: 'Menus',
                type     : 'group',
                children : [
                    {
                        id   : 'dashboard',
                        title: 'Dashboard',
                        type : 'basic',
                        icon : 'heroicons_outline:home',
                        link : '/ealert/dashboard'
                    },
                    {
                        id   : 'user-management',
                        title: 'User Management',
                        type : 'collapsable',
                        icon : 'heroicons_outline:users',
                        children :[
                            {
                                id    : 'add-user',
                                title : 'Create User',
                                type  : 'basic',
                                link  : '/ealert/user-management/user/create'
                            },
                            {
                                id    : 'manage-users',
                                title : 'Manage Users',
                                type  : 'basic',
                                link  : '/ealert/user-management/users'
                            },
                            {
                                id    : 'authorize-user',
                                title : 'Authorize User',
                                type  : 'basic',
                                link  : '/ealert/user-management/user/authorize'
                            }
                        ]
                    },
                    // {
                    //     id   : 'charges',
                    //     title: 'Charges',
                    //     type : 'collapsable',
                    //     icon : 'heroicons_outline:currency-dollar',
                    //     children :[
                    //         {
                    //             id    : 'charge-configuration',
                    //             title : 'Charges Configuration',
                    //             type  : 'basic',
                    //             link  : '/ealert/charges/configuration'
                    //         },
                    //         {
                    //             id    : 'process',
                    //             title : 'Process Charge',
                    //             type  : 'basic',
                    //             link  : '/ealert/charges/process'
                    //         },
                    //     ]
                    // },
                    {
                        id   : 'customer-management',
                        title: 'Customer Management',
                        type : 'collapsable',
                        icon : 'heroicons_outline:user-group',
                        children :[
                            {
                                id    : 'add-customer',
                                title : 'Register Customer',
                                type  : 'basic',
                                link  : '/ealert/customer-management/customer/create'
                            },
                            {
                                id    : 'manage-customer',
                                title : 'Manage Customer',
                                type  : 'basic',
                                link  : '/ealert/customer-management/customers'
                            },
                            {
                                id    : 'authorize-customer',
                                title : 'Authorize Customer',
                                type  : 'basic',
                                link  : '/ealert/customer-management/customer/authorize'
                            },
                            // {
                            //     id    : 'customer-exemption',
                            //     title : 'Customer Exemption',
                            //     type  : 'basic',
                            //     link  : '/ealert/customer-management/customer-exemption'
                            // },
                        ]
                    },

                    {
                        id   : 'report',
                        title: 'Reports',
                        type : 'collapsable',
                        icon : 'heroicons_outline:chart-pie',
                        children :[
                            {
                                id    : 'activity',
                                title : 'Audit Trail',
                                type  : 'basic',
                                link  : '/ealert/report/activity-log'
                            },
                            {
                                id    : 'sms',
                                title : 'Transaction SMS Alert',
                                type  : 'basic',
                                link  : '/ealert/report/sms'
                            },
                            {
                                id    : 'email',
                                title : 'Transaction Email Alert',
                                type  : 'basic',
                                link  : '/ealert/report/email'
                            },
                            {
                                id    : 'birthday-sms',
                                title : 'Birthday Sms',
                                type  : 'basic',
                                link  : '/ealert/report/birthday-sms'
                            },
                            {
                                id    : 'birthday-email',
                                title : 'Birthday Email',
                                type  : 'basic',
                                link  : '/ealert/report/birthday-email'
                            },
                            {
                                id    : 'new-account-sms',
                                title : 'New Account Sms',
                                type  : 'basic',
                                link  : '/ealert/report/new-account-opening-sms'
                            },
                            {
                                id    : 'new-account-email',
                                title : 'New Account Email',
                                type  : 'basic',
                                link  : '/ealert/report/new-account-opening-email'
                            },
                            // {
                            //     id    : 'broadcast',
                            //     title : 'Broadcast Report',
                            //     type  : 'basic',
                            //     link  : '/ealert/report/broadcast'
                            // },
                            {
                                id    : 'customer',
                                title : 'Customers/Accts Report',
                                type  : 'basic',
                                link  : '/ealert/report/customers'
                            },
                            {
                                id    : 'charges',
                                title : 'Charges Report',
                                type  : 'basic',
                                link  : '/ealert/report/charges'
                            }
                        ]
                    },
                    {
                        id   : 'broadcast',
                        title: 'Broadcast',
                        type : 'collapsable',
                        icon : 'heroicons_outline:rss',
                        children :[
                            {
                                id    : 'broadcast-sms',
                                title : 'Broadcast SMS Message',
                                type  : 'basic',
                                link  : '/ealert/broadcast/sms'
                            },
                            {
                                id    : 'authorize-sms',
                                title : 'Authorize SMS Broadcast',
                                type  : 'basic',
                                link  : '/ealert/broadcast/authorize-sms'
                            },
                            {
                                id    : 'broadcast-email',
                                title : 'Broadcast Email Message',
                                type  : 'basic',
                                link  : '/ealert/broadcast/email'
                            },
                            {
                                id    : 'authorize-email',
                                title : 'Authorize Email Broadcast',
                                type  : 'basic',
                                link  : '/ealert/broadcast/authorize-email'
                            },
                            {
                                id    : 'broadcast-contacts',
                                title : 'Broadcast Contacts',
                                type  : 'basic',
                                link  : '/ealert/broadcast/contacts'
                            }
                        ]
                    },
                    {
                        id   : 'adhoc',
                        title: 'AD-HOC Statements',
                        type : 'collapsable',
                        icon : 'heroicons_outline:document-text',
                        children :[
                            {
                                id    : 'estatement',
                                title : 'e-Statements',
                                type  : 'basic',
                                link  : '/ealert/adhoc/estatement'
                            },
                            // {
                            //     id    : 'pfstatement',
                            //     title : 'PDF Statements',
                            //     type  : 'basic',
                            //     link  : '/ealert/adhoc/pfstatement'
                            // }
                        ]
                    },
                    {
                        id   : 'settings',
                        title: 'System Setup',
                        type : 'collapsable',
                        icon : 'heroicons_outline:cog',
                        children :[
                            {
                                id    : 'departments',
                                title : 'Create Department',
                                type  : 'basic',
                                link  : '/ealert/settings/department'
                            },
                            {
                                id    : 'transaction-exemption',
                                title : 'Transaction Exemption',
                                type  : 'basic',
                                link  : '/ealert/settings/transaction-exemption'
                            },
                            {
                                id    : 'change-password',
                                title : 'Change Password',
                                type  : 'basic',
                                link  : '/ealert/settings/change-password'
                            },
                            // {
                            //     id    : 'charges',
                            //     title : 'Charges Managment',
                            //     type  : 'basic',
                            //     link  : '/ealert/settings/charge-managment'
                            // },
                            {
                                id    : 'profile',
                                title : 'Profile Account',
                                type  : 'basic',
                                link  : '/ealert/settings/profile'
                            },
                            {
                                id    : 'change-theme',
                                title : 'Change Theme',
                                type  : 'basic',
                                link  : '/ealert/settings/change-theme'
                            }
                        ]
                    },
                    {
                        id: 'logout',
                        title: 'Sign Out',
                        type: 'basic',
                        icon: 'heroicons_outline:logout',
                        function : ()=> {
                            Swal.fire({
                                title: 'Confirm Sign Out',
                                html: '<div class="text-md dark:text-gray-100">Are you sure you want to sign-out?</div>',
                                showCancelButton: true,
                                confirmButtonColor: '#2a7d55',
                                width: 420,
                                imageUrl: '/assets/images/logo/DASH_BOARD_LOGO.png',
                                imageWidth: 200,
                                imageHeight: 110,
                                backdrop: 'rgba(0,0,0,0.5)',
                                buttonsStyling: false,
                                customClass: {
                                    title : 'text-xl font-semibold text-gray-900 dark:text-gray-100',
                                    popup : 'rounded-2xl mat-elevation-z8 dark:bg-gray-800',
                                    confirmButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-primary-800 hover:bg-primary-700 mr-1',
                                    cancelButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-red-600 hover:bg-red-700 ml-1'
                                },
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No'
                              }).then((result) => {
                                if (result.value) {
                                    window.location.href = '/auth/sign-in';
                                }
                              });
                        }
                    }
                ]
            };

        
        }else if(appStore.roleId.toUpperCase() === 'BANK USER') 
        {
            menu = {
                id: 'menus',
                title: 'Menus',
                type     : 'group',
                children : [
                    {
                        id   : 'dashboard',
                        title: 'Dashboard',
                        type : 'basic',
                        icon : 'heroicons_outline:home',
                        link : '/ealert/dashboard'
                    },
                    {
                        id   : 'user-management',
                        title: 'User Management',
                        type : 'collapsable',
                        icon : 'heroicons_outline:users',
                        children :[
                            {
                                id    : 'add-user',
                                title : 'Create User',
                                type  : 'basic',
                                link  : '/ealert/user-management/user/create'
                            },
                            {
                                id    : 'manage-users',
                                title : 'Manage Users',
                                type  : 'basic',
                                link  : '/ealert/user-management/users'
                            },
                            {
                                id    : 'authorize-user',
                                title : 'Authorize User',
                                type  : 'basic',
                                link  : '/ealert/user-management/user/authorize'
                            }
                        ]
                    },
                    {
                        id   : 'settings',
                        title: 'Settings',
                        type : 'collapsable',
                        icon : 'heroicons_outline:cog',
                        children :[
                            {
                                id    : 'change-password',
                                title : 'Change Password',
                                type  : 'basic',
                                link  : '/ealert/settings/change-password'
                            },
                            {
                                id    : 'profile',
                                title : 'Profile Account',
                                type  : 'basic',
                                link  : '/ealert/settings/profile'
                            },
                            {
                                id    : 'charges',
                                title : 'Charges Managment',
                                type  : 'basic',
                                link  : '/ealert/settings/charge-managment'
                            },
                            {
                                id    : 'change-theme',
                                title : 'Change Theme',
                                type  : 'basic',
                                link  : '/ealert/settings/change-theme'
                            }
                        ]
                    },
                    {
                        id: 'logout',
                        title: 'Sign Out',
                        type: 'basic',
                        icon: 'heroicons_outline:logout',
                        function : ()=> {
                            Swal.fire({
                                title: 'Confirm Sign Out',
                                html: '<div class="text-md dark:text-gray-100">Are you sure you want to sign-out?</div>',
                                showCancelButton: true,
                                confirmButtonColor: '#1b357d',
                                width: 420,
                                imageUrl: '/assets/images/logo/DASH_BOARD_LOGO.png',
                                imageWidth: 200,
                                imageHeight: 110,
                                backdrop: 'rgba(0,0,0,0.5)',
                                buttonsStyling: false,
                                customClass: {
                                    title : 'text-xl font-semibold text-gray-900 dark:text-gray-100',
                                    popup : 'rounded-2xl mat-elevation-z8 dark:bg-gray-800',
                                    confirmButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-blue-800 hover:bg-blue-700 mr-1',
                                    cancelButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-red-600 hover:bg-red-700 ml-1'
                                },
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No'
                              }).then((result) => {
                                if (result.value) {
                                    window.location.href = '/auth/sign-in';
                                }
                              });
                        }
                    }
                ]
            };

        }else if(appStore.roleId.toUpperCase() === 'CSO AUTHORIZER') 
        {
            menu = {
                id: 'menus',
                title: 'Menus',
                type     : 'group',
                children : [
                    {
                        id   : 'dashboard',
                        title: 'Dashboard',
                        type : 'basic',
                        icon : 'heroicons_outline:home',
                        link : '/ealert/dashboard'
                    },
                    {
                        id   : 'customer-management',
                        title: 'Customer Management',
                        type : 'collapsable',
                        icon : 'heroicons_outline:user-group',
                        children :[
                            {
                                id    : 'authorize-customer',
                                title : 'Authorize Customer',
                                type  : 'basic',
                                link  : '/ealert/customer-management/customer/authorize'
                            },
                            {
                                id    : 'activate-customer',
                                title : 'Enable Customer',
                                type  : 'basic',
                                link  : '/ealert/customer-management/customer/unblock'
                            },
                        ]
                    },
                    {
                        id   : 'report',
                        title: 'Reports',
                        type : 'collapsable',
                        icon : 'heroicons_outline:chart-pie',
                        children :[
                            {
                                id    : 'transactions',
                                title : 'Transaction Report',
                                type  : 'basic',
                                link  : '/ealert/report/transactions'
                            },
                            {
                                id    : 'subscribers',
                                title : 'Subscribers Report',
                                type  : 'basic',
                                link  : '/ealert/report/subscribers'
                            }
                        ]
                    },
                    {
                        id   : 'settings',
                        title: 'Settings',
                        type : 'collapsable',
                        icon : 'heroicons_outline:cog',
                        children :[
                            {
                                id    : 'change-password',
                                title : 'Change Password',
                                type  : 'basic',
                                link  : '/ealert/settings/change-password'
                            },
                            {
                                id    : 'profile',
                                title : 'Profile Account',
                                type  : 'basic',
                                link  : '/ealert/settings/profile'
                            },
                            {
                                id    : 'change-theme',
                                title : 'Change Theme',
                                type  : 'basic',
                                link  : '/ealert/settings/change-theme'
                            }
                        ]
                    },
                    {
                        id: 'logout',
                        title: 'Sign Out',
                        type: 'basic',
                        icon: 'heroicons_outline:logout',
                        function : ()=> {
                            Swal.fire({
                                title: 'Confirm Sign Out',
                                html: '<div class="text-md dark:text-gray-100">Are you sure you want to sign-out?</div>',
                                showCancelButton: true,
                                confirmButtonColor: '#1b357d',
                                width: 420,
                                imageUrl: '/assets/images/logo/DASH_BOARD_LOGO.png',
                                imageWidth: 200,
                                imageHeight: 110,
                                backdrop: 'rgba(0,0,0,0.5)',
                                buttonsStyling: false,
                                customClass: {
                                    title : 'text-xl font-semibold text-gray-900 dark:text-gray-100',
                                    popup : 'rounded-2xl mat-elevation-z8 dark:bg-gray-800',
                                    confirmButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-blue-800 hover:bg-blue-700 mr-1',
                                    cancelButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-red-600 hover:bg-red-700 ml-1'
                                },
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No'
                              }).then((result) => {
                                if (result.value) {
                                    window.location.href = '/auth/sign-in';
                                }
                              });
                        }
                    }
                ]
            };

        }else if(appStore.roleId.toUpperCase() === 'CSO') 
        {
            menu = {
                id: 'menus',
                title: 'Menus',
                type     : 'group',
                children : [
                    {
                        id   : 'dashboard',
                        title: 'Dashboard',
                        type : 'basic',
                        icon : 'heroicons_outline:home',
                        link : '/ealert/dashboard'
                    },
                    {
                        id   : 'customer-management',
                        title: 'Customer Management',
                        type : 'collapsable',
                        icon : 'heroicons_outline:user-group',
                        children :[
                            {
                                id    : 'add-customer',
                                title : 'Create Customer',
                                type  : 'basic',
                                link  : '/ealert/customer-management/customer/create'
                            },
                            {
                                id    : 'manage-customer',
                                title : 'Manage Customer',
                                type  : 'basic',
                                link  : '/ealert/customer-management/customers'
                            }
                        ]
                    },
                    {
                        id   : 'report',
                        title: 'Reports',
                        type : 'collapsable',
                        icon : 'heroicons_outline:chart-pie',
                        children :[
                            {
                                id    : 'transactions',
                                title : 'Transaction Report',
                                type  : 'basic',
                                link  : '/ealert/report/transactions'
                            },
                            {
                                id    : 'subscribers',
                                title : 'Subscribers Report',
                                type  : 'basic',
                                link  : '/ealert/report/subscribers'
                            }
                        ]
                    },
                    {
                        id   : 'settings',
                        title: 'Settings',
                        type : 'collapsable',
                        icon : 'heroicons_outline:cog',
                        children :[
                            {
                                id    : 'change-password',
                                title : 'Change Password',
                                type  : 'basic',
                                link  : '/ealert/settings/change-password'
                            },
                            {
                                id    : 'profile',
                                title : 'Profile Account',
                                type  : 'basic',
                                link  : '/ealert/settings/profile'
                            },
                            {
                                id    : 'change-theme',
                                title : 'Change Theme',
                                type  : 'basic',
                                link  : '/ealert/settings/change-theme'
                            }
                        ]
                    },
                    {
                        id: 'logout',
                        title: 'Sign Out',
                        type: 'basic',
                        icon: 'heroicons_outline:logout',
                        function : ()=> {
                            Swal.fire({
                                title: 'Confirm Sign Out',
                                html: '<div class="text-md dark:text-gray-100">Are you sure you want to sign-out?</div>',
                                showCancelButton: true,
                                confirmButtonColor: '#1b357d',
                                width: 420,
                                imageUrl: '/assets/images/logo/DASH_BOARD_LOGO.png',
                                imageWidth: 200,
                                imageHeight: 110,
                                backdrop: 'rgba(0,0,0,0.5)',
                                buttonsStyling: false,
                                customClass: {
                                    title : 'text-xl font-semibold text-gray-900 dark:text-gray-100',
                                    popup : 'rounded-2xl mat-elevation-z8 dark:bg-gray-800',
                                    confirmButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-blue-800 hover:bg-blue-700 mr-1',
                                    cancelButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-red-600 hover:bg-red-700 ml-1'
                                },
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No'
                              }).then((result) => {
                                if (result.value) {
                                    window.location.href = '/auth/sign-in';
                                }
                              });
                        }
                    }
                ]
            };

        }else if(appStore.roleId.toUpperCase() === 'AUDIT') 
        {
            menu = {
                id: 'menus',
                title: 'Menus',
                type     : 'group',
                children : [
                    {
                        id   : 'dashboard',
                        title: 'Dashboard',
                        type : 'basic',
                        icon : 'heroicons_outline:home',
                        link : '/ealert/dashboard'
                    },
                    {
                        id   : 'report',
                        title: 'Reports',
                        type : 'collapsable',
                        icon : 'heroicons_outline:chart-pie',
                        children :[
                            {
                                id    : 'transactions',
                                title : 'Transaction Report',
                                type  : 'basic',
                                link  : '/ealert/report/transactions'
                            },
                            {
                                id    : 'subscribers',
                                title : 'Subscribers Report',
                                type  : 'basic',
                                link  : '/ealert/report/subscribers'
                            },
                            
                            {
                                id    : 'sms',
                                title : 'Transaction SMS Alert',
                                type  : 'basic',
                                link  : '/ealert/report/sms'
                            },
                            {
                                id    : 'email',
                                title : 'Transaction Email Alert',
                                type  : 'basic',
                                link  : '/ealert/report/email'
                            },
                            {
                                id    : 'birthday-sms',
                                title : 'Birthday Sms',
                                type  : 'basic',
                                link  : '/ealert/report/birthday-sms'
                            },
                            {
                                id    : 'birthday-email',
                                title : 'Birthday Email',
                                type  : 'basic',
                                link  : '/ealert/report/birthday-email'
                            },
                            {
                                id    : 'new-account-sms',
                                title : 'New Account Sms',
                                type  : 'basic',
                                link  : '/ealert/report/new-account-opening-sms'
                            },
                            {
                                id    : 'new-account-email',
                                title : 'New Account Email',
                                type  : 'basic',
                                link  : '/ealert/report/new-account-opening-email'
                            },
                            {
                                id    : 'broadcast',
                                title : 'Broadcast Report',
                                type  : 'basic',
                                link  : '/ealert/report/broadcast'
                            },
                            {
                                id    : 'gip',
                                title : 'GIP Transaction Report',
                                type  : 'basic',
                                link  : '/ealert/report/gip'
                            },
                            {
                                id    : 'otp',
                                title : 'OTP Report',
                                type  : 'basic',
                                link  : '/ealert/report/otp'
                            },
                        ]
                    },
                    {
                        id   : 'broadcast',
                        title: 'System Activities',
                        type : 'collapsable',
                        icon : 'heroicons_outline:presentation-chart-line',
                        children :[
                            {
                                id    : 'activity-history',
                                title : 'Activity History',
                                type  : 'basic',
                                link  : '/ealert/broadcast/activity-history'
                            }
                        ]
                    },
                    {
                        id   : 'settings',
                        title: 'Settings',
                        type : 'collapsable',
                        icon : 'heroicons_outline:cog',
                        children :[
                            {
                                id    : 'change-password',
                                title : 'Change Password',
                                type  : 'basic',
                                link  : '/ealert/settings/change-password'
                            },
                            {
                                id    : 'profile',
                                title : 'Profile Account',
                                type  : 'basic',
                                link  : '/ealert/settings/profile'
                            },
                            {
                                id    : 'change-theme',
                                title : 'Change Theme',
                                type  : 'basic',
                                link  : '/ealert/settings/change-theme'
                            }
                        ]
                    },
                    {
                        id: 'logout',
                        title: 'Sign Out',
                        type: 'basic',
                        icon: 'heroicons_outline:logout',
                        function : ()=> {
                            Swal.fire({
                                title: 'Confirm Sign Out',
                                html: '<div class="text-md dark:text-gray-100">Are you sure you want to sign-out?</div>',
                                showCancelButton: true,
                                confirmButtonColor: '#1b357d',
                                width: 420,
                                imageUrl: '/assets/images/logo/DASH_BOARD_LOGO.png',
                                imageWidth: 200,
                                imageHeight: 110,
                                backdrop: 'rgba(0,0,0,0.5)',
                                buttonsStyling: false,
                                customClass: {
                                    title : 'text-xl font-semibold text-gray-900 dark:text-gray-100',
                                    popup : 'rounded-2xl mat-elevation-z8 dark:bg-gray-800',
                                    confirmButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-blue-800 hover:bg-blue-700 mr-1',
                                    cancelButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-red-600 hover:bg-red-700 ml-1'
                                },
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No'
                              }).then((result) => {
                                if (result.value) {
                                    window.location.href = '/auth/sign-in';
                                }
                              });
                        }
                    }
                ]
            };

        }else if(appStore.roleId.toUpperCase() === 'BLAST USER'){
            menu = {
                id: 'menus',
                title: '',
                type     : 'group',
                children : [
                    {
                        id   : 'dashboard',
                        title: 'Dashboard',
                        type : 'basic',
                        icon : 'heroicons_outline:home',
                        link : '/ealert/dashboard'
                    },
                    {
                        id   : 'report',
                        title: 'Reports',
                        type : 'collapsable',
                        icon : 'heroicons_outline:chart-pie',
                        children :[
                            {
                                id    : 'activity', 
                                title : 'Audit Trail',
                                type  : 'basic',
                                link  : '/ealert/report/activity-log'
                            },
                            {
                                id    : 'sms',
                                title : 'Transaction SMS Alert',
                                type  : 'basic',
                                link  : '/ealert/report/sms'
                            },
                            {
                                id    : 'email',
                                title : 'Transaction Email Alert',
                                type  : 'basic',
                                link  : '/ealert/report/email'
                            },
                            {
                                id    : 'birthday-sms',
                                title : 'Birthday Sms',
                                type  : 'basic',
                                link  : '/ealert/report/birthday-sms'
                            },
                            {
                                id    : 'birthday-email',
                                title : 'Birthday Email',
                                type  : 'basic',
                                link  : '/ealert/report/birthday-email'
                            },
                            {
                                id    : 'new-account-sms',
                                title : 'New Account Sms',
                                type  : 'basic',
                                link  : '/ealert/report/new-account-opening-sms'
                            },
                            {
                                id    : 'new-account-email',
                                title : 'New Account Email',
                                type  : 'basic',
                                link  : '/ealert/report/new-account-opening-email'
                            },
                            // {
                            //     id    : 'broadcast',
                            //     title : 'Broadcast Report',
                            //     type  : 'basic',
                            //     link  : '/ealert/report/broadcast'
                            // },
                        ]
                    },
                    {
                        id   : 'broadcast',
                        title: 'Broadcast',
                        type : 'collapsable',
                        icon : 'heroicons_outline:rss',
                        children :[
                            {
                                id    : 'broadcast-sms',
                                title : 'Broadcast SMS Message',
                                type  : 'basic',
                                link  : '/ealert/broadcast/sms'
                            },
                            {
                                id    : 'broadcast-email',
                                title : 'Broadcast Email Message',
                                type  : 'basic',
                                link  : '/ealert/broadcast/email'
                            },
                            {
                                id    : 'broadcast-contacts',
                                title : 'Broadcast Contacts',
                                type  : 'basic',
                                link  : '/ealert/broadcast/contacts'
                            }
                        ]
                    },
                    {
                        id   : 'settings',
                        title: 'Settings',
                        type : 'collapsable',
                        icon : 'heroicons_outline:cog',
                        children :[
                            {
                                id    : 'change-password',
                                title : 'Change Password',
                                type  : 'basic',
                                link  : '/ealert/settings/change-password'
                            },
                            {
                                id    : 'profile',
                                title : 'Profile Account',
                                type  : 'basic',
                                link  : '/ealert/settings/profile'
                            },
                            {
                                id    : 'change-theme',
                                title : 'Change Theme',
                                type  : 'basic',
                                link  : '/ealert/settings/change-theme'
                            }
                        ]
                    },
                    {
                        id: 'logout',
                        title: 'Sign Out',
                        type: 'basic',
                        icon: 'heroicons_outline:logout',
                        function : ()=> {
                            Swal.fire({
                                title: 'Confirm Sign Out',
                                html: '<div class="text-md dark:text-gray-100">Are you sure you want to sign-out?</div>',
                                showCancelButton: true,
                                confirmButtonColor: '#1b357d',
                                width: 420,
                                imageUrl: '/assets/images/logo/DASH_BOARD_LOGO.png',
                                imageWidth: 200,
                                imageHeight: 110,
                                backdrop: 'rgba(0,0,0,0.5)',
                                buttonsStyling: false,
                                customClass: {
                                    title : 'text-xl font-semibold text-gray-900 dark:text-gray-100',
                                    popup : 'rounded-2xl mat-elevation-z8 dark:bg-gray-800',
                                    confirmButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-blue-800 hover:bg-blue-700 mr-1',
                                    cancelButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-red-600 hover:bg-red-700 ml-1'
                                },
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No'
                              }).then((result) => {
                                if (result.value) {
                                    window.location.href = '/auth/sign-in';
                                }
                              });
                        }
                    }
                ]
            };
        }else if(appStore.roleId.toUpperCase() === 'BLAST AUTHORIZER'){
            menu = {
                id: 'menus',
                title: '',
                type     : 'group',
                children : [
                    {
                        id   : 'dashboard',
                        title: 'Dashboard',
                        type : 'basic',
                        icon : 'heroicons_outline:home',
                        link : '/ealert/dashboard'
                    },
                    {
                        id   : 'broadcast',
                        title: 'Broadcast',
                        type : 'collapsable',
                        icon : 'heroicons_outline:rss',
                        children :[
                            {
                                id    : 'authorize-sms',
                                title : 'Authorize SMS Broadcast',
                                type  : 'basic',
                                link  : '/ealert/broadcast/authorize-sms'
                            },
                            {
                                id    : 'authorize-email',
                                title : 'Authorize Email Broadcast',
                                type  : 'basic',
                                link  : '/ealert/broadcast/authorize-email'
                            }

                        ]
                    },
                    {
                        id   : 'settings',
                        title: 'Settings',
                        type : 'collapsable',
                        icon : 'heroicons_outline:cog',
                        children :[
                            {
                                id    : 'change-password',
                                title : 'Change Password',
                                type  : 'basic',
                                link  : '/ealert/settings/change-password'
                            },
                            {
                                id    : 'profile',
                                title : 'Profile Account',
                                type  : 'basic',
                                link  : '/ealert/settings/profile'
                            },
                            {
                                id    : 'change-theme',
                                title : 'Change Theme',
                                type  : 'basic',
                                link  : '/ealert/settings/change-theme'
                            }
                        ]
                    },
                    {
                        id: 'logout',
                        title: 'Sign Out',
                        type: 'basic',
                        icon: 'heroicons_outline:logout',
                        function : ()=> {
                            Swal.fire({
                                title: 'Confirm Sign Out',
                                html: '<div class="text-md dark:text-gray-100">Are you sure you want to sign-out?</div>',
                                showCancelButton: true,
                                confirmButtonColor: '#1b357d',
                                width: 420,
                                imageUrl: '/assets/images/logo/DASH_BOARD_LOGO.png',
                                imageWidth: 200,
                                imageHeight: 110,
                                backdrop: 'rgba(0,0,0,0.5)',
                                buttonsStyling: false,
                                customClass: {
                                    title : 'text-xl font-semibold text-gray-900 dark:text-gray-100',
                                    popup : 'rounded-2xl mat-elevation-z8 dark:bg-gray-800',
                                    confirmButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-blue-800 hover:bg-blue-700 mr-1',
                                    cancelButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-red-600 hover:bg-red-700 ml-1'
                                },
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No'
                              }).then((result) => {
                                if (result.value) {
                                    window.location.href = '/auth/sign-in';
                                }
                              });
                        }
                    }

                ]
            };
        }else if(appStore.roleId.toUpperCase() === 'E-BUSINESS'){
            menu = {
                id: 'menus',
                title: '',
                type     : 'group',
                children : [
                    {
                        id   : 'dashboard',
                        title: 'Dashboard',
                        type : 'basic',
                        icon : 'heroicons_outline:home',
                        link : '/ealert/dashboard'
                    },
                    {
                        id   : 'report',
                        title: 'Reports',
                        type : 'collapsable',
                        icon : 'heroicons_outline:chart-pie',
                        children :[                            
                            {
                                id    : 'activity',
                                title : 'Audit Trail',
                                type  : 'basic',
                                link  : '/ealert/report/activity-log'
                            },
                            {
                                id    : 'sms',
                                title : 'Transaction SMS Alert',
                                type  : 'basic',
                                link  : '/ealert/report/sms'
                            },
                            {
                                id    : 'email',
                                title : 'Transaction Email Alert',
                                type  : 'basic',
                                link  : '/ealert/report/email'
                            },
                            {
                                id    : 'birthday-sms',
                                title : 'Birthday Sms',
                                type  : 'basic',
                                link  : '/ealert/report/birthday-sms'
                            },
                            {
                                id    : 'birthday-email',
                                title : 'Birthday Email',
                                type  : 'basic',
                                link  : '/ealert/report/birthday-email'
                            },
                            {
                                id    : 'new-account-sms',
                                title : 'New Account Sms',
                                type  : 'basic',
                                link  : '/ealert/report/new-account-opening-sms'
                            },
                            {
                                id    : 'new-account-email',
                                title : 'New Account Email',
                                type  : 'basic',
                                link  : '/ealert/report/new-account-opening-email'
                            },
                            {
                                id    : 'broadcast',
                                title : 'Broadcast Report',
                                type  : 'basic',
                                link  : '/ealert/report/broadcast'
                            },
                        ]
                    },
                    {
                        id   : 'adhoc',
                        title: 'AD-HOC Statements',
                        type : 'collapsable',
                        icon : 'heroicons_outline:document-text',
                        children :[
                            {
                                id    : 'estatement',
                                title : 'e-Statements',
                                type  : 'basic',
                                link  : '/ealert/adhoc/estatement'
                            },
                            // {
                            //     id    : 'pfstatement',
                            //     title : 'PDF Statements',
                            //     type  : 'basic',
                            //     link  : '/ealert/adhoc/pfstatement'
                            // }
                        ]
                    },
                    {
                        id   : 'settings',
                        title: 'Settings',
                        type : 'collapsable',
                        icon : 'heroicons_outline:cog',
                        children :[
                            {
                                id    : 'departments',
                                title : 'Create Department',
                                type  : 'basic',
                                link  : '/ealert/settings/department'
                            },
                            {
                                id    : 'transaction-exemption',
                                title : 'Transaction Exemption',
                                type  : 'basic',
                                link  : '/ealert/settings/transaction-exemption'
                            },
                            {
                                id    : 'change-password',
                                title : 'Change Password',
                                type  : 'basic',
                                link  : '/ealert/settings/change-password'
                            },
                            {
                                id    : 'charges',
                                title : 'Charges Managment',
                                type  : 'basic',
                                link  : '/ealert/settings/charge-managment'
                            },
                            {
                                id    : 'profile',
                                title : 'Profile Account',
                                type  : 'basic',
                                link  : '/ealert/settings/profile'
                            },
                            {
                                id    : 'change-theme',
                                title : 'Change Theme',
                                type  : 'basic',
                                link  : '/ealert/settings/change-theme'
                            }
                        ]
                    },
                    {
                        id: 'logout',
                        title: 'Sign Out',
                        type: 'basic',
                        icon: 'heroicons_outline:logout',
                        function : ()=> {
                            Swal.fire({
                                title: 'Confirm Sign Out',
                                html: '<div class="text-md dark:text-gray-100">Are you sure you want to sign-out?</div>',
                                showCancelButton: true,
                                confirmButtonColor: '#1b357d',
                                width: 420,
                                imageUrl: '/assets/images/logo/DASH_BOARD_LOGO.png',
                                imageWidth: 200,
                                imageHeight: 110,
                                backdrop: 'rgba(0,0,0,0.5)',
                                buttonsStyling: false,
                                customClass: {
                                    title : 'text-xl font-semibold text-gray-900 dark:text-gray-100',
                                    popup : 'rounded-2xl mat-elevation-z8 dark:bg-gray-800',
                                    confirmButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-blue-800 hover:bg-blue-700 mr-1',
                                    cancelButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-red-600 hover:bg-red-700 ml-1'
                                },
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No'
                              }).then((result) => {
                                if (result.value) {
                                    window.location.href = '/auth/sign-in';
                                }
                              });
                        }
                    }
                ]
            };
        }else {                                                                                             
            menu = {
                id: 'menus',
                title: '',
                type     : 'group',
                children : []
            };
        }
    }else {
        // SUPER ADMIN
     if(appStore.roleId.toUpperCase() === 'BANK ADMIN') 
        {
            menu = {
                id: 'menus',
                title: 'Menus',
                type     : 'group',
                children : [
                    {
                        id   : 'dashboard',
                        title: 'Dashboard',
                        type : 'basic',
                        icon : 'heroicons_outline:home',
                        link : '/ealert/dashboard'
                    },
                    {
                        id   : 'user-management',
                        title: 'User Management',
                        type : 'collapsable',
                        icon : 'heroicons_outline:users',
                        children :[
                            {
                                id    : 'add-user',
                                title : 'Create User',
                                type  : 'basic',
                                link  : '/ealert/user-management/user/create'
                            },
                            {
                                id    : 'deactivate-user',
                                title : 'Disable User',
                                type  : 'basic',
                                link  : '/ealert/user-management/user/block'
                            },
                            {
                                id    : 'activate-user',
                                title : 'Enable User',
                                type  : 'basic',
                                link  : '/ealert/user-management/user/unblock'
                            },
                            {
                                id    : 'manage-users',
                                title : 'Manage Users',
                                type  : 'basic',
                                link  : '/ealert/user-management/users'
                            },
                            {
                                id    : 'authorize-user',
                                title : 'Authorize User',
                                type  : 'basic',
                                link  : '/ealert/user-management/user/authorize'
                            },
                            {
                                id    : 'unlock-user',
                                title : 'Unlock User',
                                type  : 'basic',
                                link  : '/ealert/user-management/user/unlock'
                            }
                        ]
                    },
                    {
                        id   : 'settings',
                        title: 'Settings',
                        type : 'collapsable',
                        icon : 'heroicons_outline:cog',
                        children :[
                            {
                                id    : 'change-password',
                                title : 'Change Password',
                                type  : 'basic',
                                link  : '/ealert/settings/change-password'
                            },
                            {
                                id    : 'profile',
                                title : 'Profile Account',
                                type  : 'basic',
                                link  : '/ealert/settings/profile'
                            },
                            {
                                id    : 'charges',
                                title : 'Charges Managment',
                                type  : 'basic',
                                link  : '/ealert/settings/charge-managment'
                            },
                            {
                                id    : 'change-theme',
                                title : 'Change Theme',
                                type  : 'basic',
                                link  : '/ealert/settings/change-theme'
                            }
                        ]
                    },
                    {
                        id: 'logout',
                        title: 'Sign Out',
                        type: 'basic',
                        icon: 'heroicons_outline:logout',
                        function : ()=> {
                            Swal.fire({
                                title: 'Confirm Sign Out',
                                html: '<div class="text-md dark:text-gray-100">Are you sure you want to sign-out?</div>',
                                showCancelButton: true,
                                confirmButtonColor: '#1b357d',
                                width: 420,
                                imageUrl: '/assets/images/logo/DASH_BOARD_LOGO.png',
                                imageWidth: 200,
                                imageHeight: 110,
                                backdrop: 'rgba(0,0,0,0.5)',
                                buttonsStyling: false,
                                customClass: {
                                    title : 'text-xl font-semibold text-gray-900 dark:text-gray-100',
                                    popup : 'rounded-2xl mat-elevation-z8 dark:bg-gray-800',
                                    confirmButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-blue-800 hover:bg-blue-700 mr-1',
                                    cancelButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-red-600 hover:bg-red-700 ml-1'
                                },
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No'
                              }).then((result) => {
                                if (result.value) {
                                    window.location.href = '/auth/sign-in';
                                }
                              });
                        }
                    }
                ]
            };

        }else if(appStore.roleId.toUpperCase() === 'CSO AUTHORIZER') 
        {
            menu = {
                id: 'menus',
                title: 'Menus',
                type     : 'group',
                children : [
                    {
                        id   : 'dashboard',
                        title: 'Dashboard',
                        type : 'basic',
                        icon : 'heroicons_outline:home',
                        link : '/ealert/dashboard'
                    },
                    {
                        id   : 'customer-management',
                        title: 'Customer Management',
                        type : 'collapsable',
                        icon : 'heroicons_outline:user-group',
                        children :[
                            {
                                id    : 'authorize-customer',
                                title : 'Authorize Customer',
                                type  : 'basic',
                                link  : '/ealert/customer-management/customer/authorize'
                            },
                            {
                                id    : 'activate-customer',
                                title : 'Enable Customer',
                                type  : 'basic',
                                link  : '/ealert/customer-management/customer/unblock'
                            },
                        ]
                    },
                    {
                        id   : 'report',
                        title: 'Reports',
                        type : 'collapsable',
                        icon : 'heroicons_outline:chart-pie',
                        children :[
                            {
                                id    : 'transactions',
                                title : 'Transaction Report',
                                type  : 'basic',
                                link  : '/ealert/report/transactions'
                            },
                            {
                                id    : 'subscribers',
                                title : 'Subscribers Report',
                                type  : 'basic',
                                link  : '/ealert/report/subscribers'
                            }
                        ]
                    },
                    {
                        id   : 'settings',
                        title: 'Settings',
                        type : 'collapsable',
                        icon : 'heroicons_outline:cog',
                        children :[
                            {
                                id    : 'change-password',
                                title : 'Change Password',
                                type  : 'basic',
                                link  : '/ealert/settings/change-password'
                            },
                            {
                                id    : 'profile',
                                title : 'Profile Account',
                                type  : 'basic',
                                link  : '/ealert/settings/profile'
                            },
                            {
                                id    : 'change-theme',
                                title : 'Change Theme',
                                type  : 'basic',
                                link  : '/ealert/settings/change-theme'
                            }
                        ]
                    },
                    {
                        id: 'logout',
                        title: 'Sign Out',
                        type: 'basic',
                        icon: 'heroicons_outline:logout',
                        function : ()=> {
                            Swal.fire({
                                title: 'Confirm Sign Out',
                                html: '<div class="text-md dark:text-gray-100">Are you sure you want to sign-out?</div>',
                                showCancelButton: true,
                                confirmButtonColor: '#1b357d',
                                width: 420,
                                imageUrl: '/assets/images/logo/DASH_BOARD_LOGO.png',
                                imageWidth: 200,
                                imageHeight: 110,
                                backdrop: 'rgba(0,0,0,0.5)',
                                buttonsStyling: false,
                                customClass: {
                                    title : 'text-xl font-semibold text-gray-900 dark:text-gray-100',
                                    popup : 'rounded-2xl mat-elevation-z8 dark:bg-gray-800',
                                    confirmButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-blue-800 hover:bg-blue-700 mr-1',
                                    cancelButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-red-600 hover:bg-red-700 ml-1'
                                },
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No'
                              }).then((result) => {
                                if (result.value) {
                                    window.location.href = '/auth/sign-in';
                                }
                              });
                        }
                    }
                ]
            };

        }else if(appStore.roleId.toUpperCase() === 'CSO') 
        {
            menu = {
                id: 'menus',
                title: 'Menus',
                type     : 'group',
                children : [
                    {
                        id   : 'dashboard',
                        title: 'Dashboard',
                        type : 'basic',
                        icon : 'heroicons_outline:home',
                        link : '/ealert/dashboard'
                    },
                    {
                        id   : 'customer-management',
                        title: 'Customer Management',
                        type : 'collapsable',
                        icon : 'heroicons_outline:user-group',
                        children :[
                            {
                                id    : 'add-customer',
                                title : 'Create Customer',
                                type  : 'basic',
                                link  : '/ealert/customer-management/customer/create'
                            },
                            {
                                id    : 'manage-customer',
                                title : 'Manage Customer',
                                type  : 'basic',
                                link  : '/ealert/customer-management/customers'
                            }
                        ]
                    },
                    {
                        id   : 'report',
                        title: 'Reports',
                        type : 'collapsable',
                        icon : 'heroicons_outline:chart-pie',
                        children :[
                            {
                                id    : 'transactions',
                                title : 'Transaction Report',
                                type  : 'basic',
                                link  : '/ealert/report/transactions'
                            },
                            {
                                id    : 'subscribers',
                                title : 'Subscribers Report',
                                type  : 'basic',
                                link  : '/ealert/report/subscribers'
                            }
                        ]
                    },
                    {
                        id   : 'settings',
                        title: 'Settings',
                        type : 'collapsable',
                        icon : 'heroicons_outline:cog',
                        children :[
                            {
                                id    : 'change-password',
                                title : 'Change Password',
                                type  : 'basic',
                                link  : '/ealert/settings/change-password'
                            },
                            {
                                id    : 'profile',
                                title : 'Profile Account',
                                type  : 'basic',
                                link  : '/ealert/settings/profile'
                            },
                            {
                                id    : 'change-theme',
                                title : 'Change Theme',
                                type  : 'basic',
                                link  : '/ealert/settings/change-theme'
                            }
                        ]
                    },
                    {
                        id: 'logout',
                        title: 'Sign Out',
                        type: 'basic',
                        icon: 'heroicons_outline:logout',
                        function : ()=> {
                            Swal.fire({
                                title: 'Confirm Sign Out',
                                html: '<div class="text-md dark:text-gray-100">Are you sure you want to sign-out?</div>',
                                showCancelButton: true,
                                confirmButtonColor: '#1b357d',
                                width: 420,
                                imageUrl: '/assets/images/logo/DASH_BOARD_LOGO.png',
                                imageWidth: 200,
                                imageHeight: 110,
                                backdrop: 'rgba(0,0,0,0.5)',
                                buttonsStyling: false,
                                customClass: {
                                    title : 'text-xl font-semibold text-gray-900 dark:text-gray-100',
                                    popup : 'rounded-2xl mat-elevation-z8 dark:bg-gray-800',
                                    confirmButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-blue-800 hover:bg-blue-700 mr-1',
                                    cancelButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-red-600 hover:bg-red-700 ml-1'
                                },
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No'
                              }).then((result) => {
                                if (result.value) {
                                    window.location.href = '/auth/sign-in';
                                }
                              });
                        }
                    }
                ]
            };

        }else if(appStore.roleId.toUpperCase() === 'AUDIT') 
        {
            menu = {
                id: 'menus',
                title: 'Menus',
                type     : 'group',
                children : [
                    {
                        id   : 'dashboard',
                        title: 'Dashboard',
                        type : 'basic',
                        icon : 'heroicons_outline:home',
                        link : '/ealert/dashboard'
                    },
                    {
                        id   : 'report',
                        title: 'Reports',
                        type : 'collapsable',
                        icon : 'heroicons_outline:chart-pie',
                        children :[
                            {
                                id    : 'transactions',
                                title : 'Transaction Report',
                                type  : 'basic',
                                link  : '/ealert/report/transactions'
                            },
                            {
                                id    : 'subscribers',
                                title : 'Subscribers Report',
                                type  : 'basic',
                                link  : '/ealert/report/subscribers'
                            },
                            
                            {
                                id    : 'sms',
                                title : 'Transaction SMS Alert',
                                type  : 'basic',
                                link  : '/ealert/report/sms'
                            },
                            {
                                id    : 'email',
                                title : 'Transaction Email Alert',
                                type  : 'basic',
                                link  : '/ealert/report/email'
                            },
                            {
                                id    : 'birthday-sms',
                                title : 'Birthday Sms',
                                type  : 'basic',
                                link  : '/ealert/report/birthday-sms'
                            },
                            {
                                id    : 'birthday-email',
                                title : 'Birthday Email',
                                type  : 'basic',
                                link  : '/ealert/report/birthday-email'
                            },
                            {
                                id    : 'new-account-sms',
                                title : 'New Account Sms',
                                type  : 'basic',
                                link  : '/ealert/report/new-account-opening-sms'
                            },
                            {
                                id    : 'new-account-email',
                                title : 'New Account Email',
                                type  : 'basic',
                                link  : '/ealert/report/new-account-opening-email'
                            },
                            {
                                id    : 'broadcast',
                                title : 'Broadcast Report',
                                type  : 'basic',
                                link  : '/ealert/report/broadcast'
                            },
                            {
                                id    : 'gip',
                                title : 'GIP Transaction Report',
                                type  : 'basic',
                                link  : '/ealert/report/gip'
                            },
                            {
                                id    : 'otp',
                                title : 'OTP Report',
                                type  : 'basic',
                                link  : '/ealert/report/otp'
                            },
                        ]
                    },
                    // {
                    //     id   : 'broadcast',
                    //     title: 'System Activities',
                    //     type : 'collapsable',
                    //     icon : 'heroicons_outline:presentation-chart-line',
                    //     children :[
                    //         {
                    //         {
                    //             id    : 'activity-history',
                    //             title : 'Activity History',
                    //             type  : 'basic',
                    //             link  : '/ealert/broadcast/activity-history'
                    //         }
                    //     ]
                    // },
                    {
                        id   : 'settings',
                        title: 'Settings',
                        type : 'collapsable',
                        icon : 'heroicons_outline:cog',
                        children :[
                            {
                                id    : 'change-password',
                                title : 'Change Password',
                                type  : 'basic',
                                link  : '/ealert/settings/change-password'
                            },
                            {
                                id    : 'profile',
                                title : 'Profile Account',
                                type  : 'basic',
                                link  : '/ealert/settings/profile'
                            },
                            {
                                id    : 'change-theme',
                                title : 'Change Theme',
                                type  : 'basic',
                                link  : '/ealert/settings/change-theme'
                            }
                        ]
                    },
                    {
                        id: 'logout',
                        title: 'Sign Out',
                        type: 'basic',
                        icon: 'heroicons_outline:logout',
                        function : ()=> {
                            Swal.fire({
                                title: 'Confirm Sign Out',
                                html: '<div class="text-md dark:text-gray-100">Are you sure you want to sign-out?</div>',
                                showCancelButton: true,
                                confirmButtonColor: '#1b357d',
                                width: 420,
                                imageUrl: '/assets/images/logo/DASH_BOARD_LOGO.png',
                                imageWidth: 200,
                                imageHeight: 110,
                                backdrop: 'rgba(0,0,0,0.5)',
                                buttonsStyling: false,
                                customClass: {
                                    title : 'text-xl font-semibold text-gray-900 dark:text-gray-100',
                                    popup : 'rounded-2xl mat-elevation-z8 dark:bg-gray-800',
                                    confirmButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-blue-800 hover:bg-blue-700 mr-1',
                                    cancelButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-red-600 hover:bg-red-700 ml-1'
                                },
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No'
                              }).then((result) => {
                                if (result.value) {
                                    window.location.href = '/auth/sign-in';
                                }
                              });
                        }
                    }
                ]
            };

        }else if(appStore.roleId.toUpperCase() === 'BLAST USER'){
            menu = {
                id: 'menus',
                title: '',
                type     : 'group',
                children : [
                    {
                        id   : 'dashboard',
                        title: 'Dashboard',
                        type : 'basic',
                        icon : 'heroicons_outline:home',
                        link : '/ealert/dashboard'
                    },
                    {
                        id   : 'report',
                        title: 'Reports',
                        type : 'collapsable',
                        icon : 'heroicons_outline:chart-pie',
                        children :[
                            {
                                id    : 'activity',
                                title : 'Audit Trail',
                                type  : 'basic',
                                link  : '/ealert/report/activity-log'
                            },
                            {
                                id    : 'sms',
                                title : 'Transaction SMS Alert',
                                type  : 'basic',
                                link  : '/ealert/report/sms'
                            },
                            {
                                id    : 'email',
                                title : 'Transaction Email Alert',
                                type  : 'basic',
                                link  : '/ealert/report/email'
                            },
                            {
                                id    : 'birthday-sms',
                                title : 'Birthday Sms',
                                type  : 'basic',
                                link  : '/ealert/report/birthday-sms'
                            },
                            {
                                id    : 'birthday-email',
                                title : 'Birthday Email',
                                type  : 'basic',
                                link  : '/ealert/report/birthday-email'
                            },
                            {
                                id    : 'new-account-sms',
                                title : 'New Account Sms',
                                type  : 'basic',
                                link  : '/ealert/report/new-account-opening-sms'
                            },
                            {
                                id    : 'new-account-email',
                                title : 'New Account Email',
                                type  : 'basic',
                                link  : '/ealert/report/new-account-opening-email'
                            },
                            {
                                id    : 'broadcast',
                                title : 'Broadcast Report',
                                type  : 'basic',
                                link  : '/ealert/report/broadcast'
                            },
                        ]
                    },
                    {
                        id   : 'broadcast',
                        title: 'Broadcast',
                        type : 'collapsable',
                        icon : 'heroicons_outline:rss',
                        children :[
                            {
                                id    : 'broadcast-sms',
                                title : 'Broadcast SMS Message',
                                type  : 'basic',
                                link  : '/ealert/broadcast/sms'
                            },
                            {
                                id    : 'broadcast-email',
                                title : 'Broadcast Email Message',
                                type  : 'basic',
                                link  : '/ealert/broadcast/email'
                            },
                            {
                                id    : 'broadcast-contacts',
                                title : 'Broadcast Contacts',
                                type  : 'basic',
                                link  : '/ealert/broadcast/contacts'
                            }
                        ]
                    },
                    {
                        id   : 'settings',
                        title: 'Settings',
                        type : 'collapsable',
                        icon : 'heroicons_outline:cog',
                        children :[
                            {
                                id    : 'change-password',
                                title : 'Change Password',
                                type  : 'basic',
                                link  : '/ealert/settings/change-password'
                            },
                            {
                                id    : 'profile',
                                title : 'Profile Account',
                                type  : 'basic',
                                link  : '/ealert/settings/profile'
                            },
                            {
                                id    : 'change-theme',
                                title : 'Change Theme',
                                type  : 'basic',
                                link  : '/ealert/settings/change-theme'
                            }
                        ]
                    },
                    {
                        id: 'logout',
                        title: 'Sign Out',
                        type: 'basic',
                        icon: 'heroicons_outline:logout',
                        function : ()=> {
                            Swal.fire({
                                title: 'Confirm Sign Out',
                                html: '<div class="text-md dark:text-gray-100">Are you sure you want to sign-out?</div>',
                                showCancelButton: true,
                                confirmButtonColor: '#1b357d',
                                width: 420,
                                imageUrl: '/assets/images/logo/DASH_BOARD_LOGO.png',
                                imageWidth: 200,
                                imageHeight: 110,
                                backdrop: 'rgba(0,0,0,0.5)',
                                buttonsStyling: false,
                                customClass: {
                                    title : 'text-xl font-semibold text-gray-900 dark:text-gray-100',
                                    popup : 'rounded-2xl mat-elevation-z8 dark:bg-gray-800',
                                    confirmButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-blue-800 hover:bg-blue-700 mr-1',
                                    cancelButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-red-600 hover:bg-red-700 ml-1'
                                },
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No'
                              }).then((result) => {
                                if (result.value) {
                                    window.location.href = '/auth/sign-in';
                                }
                              });
                        }
                    }
                ]
            };
        }else if(appStore.roleId.toUpperCase() === 'BLAST AUTHORIZER'){
            menu = {
                id: 'menus',
                title: '',
                type     : 'group',
                children : [
                    {
                        id   : 'dashboard',
                        title: 'Dashboard',
                        type : 'basic',
                        icon : 'heroicons_outline:home',
                        link : '/ealert/dashboard'
                    },
                    {
                        id   : 'broadcast',
                        title: 'Broadcast',
                        type : 'collapsable',
                        icon : 'heroicons_outline:rss',
                        children :[
                            {
                                id    : 'authorize-sms',
                                title : 'Authorize SMS Broadcast',
                                type  : 'basic',
                                link  : '/ealert/broadcast/authorize-sms'
                            },
                            {
                                id    : 'authorize-email',
                                title : 'Authorize Email Broadcast',
                                type  : 'basic',
                                link  : '/ealert/broadcast/authorize-email'
                            }
                        ]
                    },
                    {
                        id   : 'settings',
                        title: 'Settings',
                        type : 'collapsable',
                        icon : 'heroicons_outline:cog',
                        children :[
                            {
                                id    : 'change-password',
                                title : 'Change Password',
                                type  : 'basic',
                                link  : '/ealert/settings/change-password'
                            },
                            {
                                id    : 'profile',
                                title : 'Profile Account',
                                type  : 'basic',
                                link  : '/ealert/settings/profile'
                            },
                            {
                                id    : 'change-theme',
                                title : 'Change Theme',
                                type  : 'basic',
                                link  : '/ealert/settings/change-theme'
                            }
                        ]
                    },
                    {
                        id: 'logout',
                        title: 'Sign Out',
                        type: 'basic',
                        icon: 'heroicons_outline:logout',
                        function : ()=> {
                            Swal.fire({
                                title: 'Confirm Sign Out',
                                html: '<div class="text-md dark:text-gray-100">Are you sure you want to sign-out?</div>',
                                showCancelButton: true,
                                confirmButtonColor: '#1b357d',
                                width: 420,
                                imageUrl: '/assets/images/logo/DASH_BOARD_LOGO.png',
                                imageWidth: 200,
                                imageHeight: 110,
                                backdrop: 'rgba(0,0,0,0.5)',
                                buttonsStyling: false,
                                customClass: {
                                    title : 'text-xl font-semibold text-gray-900 dark:text-gray-100',
                                    popup : 'rounded-2xl mat-elevation-z8 dark:bg-gray-800',
                                    confirmButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-blue-800 hover:bg-blue-700 mr-1',
                                    cancelButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-red-600 hover:bg-red-700 ml-1'
                                },
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No'
                              }).then((result) => {
                                if (result.value) {
                                    window.location.href = '/auth/sign-in';
                                }
                              });
                        }
                    }

                ]
            };
        }else if(appStore.roleId.toUpperCase() === 'E-BUSINESS'){
            menu = {
                id: 'menus',
                title: '',
                type     : 'group',
                children : [
                    {
                        id   : 'dashboard',
                        title: 'Dashboard',
                        type : 'basic',
                        icon : 'heroicons_outline:home',
                        link : '/ealert/dashboard'
                    },
                    {
                        id   : 'report',
                        title: 'Reports',
                        type : 'collapsable',
                        icon : 'heroicons_outline:chart-pie',
                        children :[                            
                            {
                                id    : 'activity',
                                title : 'Audit Trail',
                                type  : 'basic',
                                link  : '/ealert/report/activity-log'
                            },
                            {
                                id    : 'sms',
                                title : 'Transaction SMS Alert',
                                type  : 'basic',
                                link  : '/ealert/report/sms'
                            },
                            {
                                id    : 'email',
                                title : 'Transaction Email Alert',
                                type  : 'basic',
                                link  : '/ealert/report/email'
                            },
                            {
                                id    : 'birthday-sms',
                                title : 'Birthday Sms',
                                type  : 'basic',
                                link  : '/ealert/report/birthday-sms'
                            },
                            {
                                id    : 'birthday-email',
                                title : 'Birthday Email',
                                type  : 'basic',
                                link  : '/ealert/report/birthday-email'
                            },
                            {
                                id    : 'new-account-sms',
                                title : 'New Account Sms',
                                type  : 'basic',
                                link  : '/ealert/report/new-account-opening-sms'
                            },
                            {
                                id    : 'new-account-email',
                                title : 'New Account Email',
                                type  : 'basic',
                                link  : '/ealert/report/new-account-opening-email'
                            },
                            {
                                id    : 'broadcast',
                                title : 'Broadcast Report',
                                type  : 'basic',
                                link  : '/ealert/report/broadcast'
                            },
                        ]
                    },
                    {
                        id   : 'adhoc',
                        title: 'AD-HOC Statements',
                        type : 'collapsable',
                        icon : 'heroicons_outline:document-text',
                        children :[
                            {
                                id    : 'estatement',
                                title : 'e-Statements',
                                type  : 'basic',
                                link  : '/ealert/adhoc/estatement'
                            },
                            // {
                            //     id    : 'pfstatement',
                            //     title : 'PDF Statements',
                            //     type  : 'basic',
                            //     link  : '/ealert/adhoc/pfstatement'
                            // }
                        ]
                    },
                    {
                        id   : 'settings',
                        title: 'Settings',
                        type : 'collapsable',
                        icon : 'heroicons_outline:cog',
                        children :[
                            {
                                id    : 'departments',
                                title : 'Create Department',
                                type  : 'basic',
                                link  : '/ealert/settings/department'
                            },
                            {
                                id    : 'transaction-exemption',
                                title : 'Transaction Exemption',
                                type  : 'basic',
                                link  : '/ealert/settings/transaction-exemption'
                            },
                            {
                                id    : 'change-password',
                                title : 'Change Password',
                                type  : 'basic',
                                link  : '/ealert/settings/change-password'
                            },
                            {
                                id    : 'charges',
                                title : 'Charges Managment',
                                type  : 'basic',
                                link  : '/ealert/settings/charge-managment'
                            },
                            {
                                id    : 'profile',
                                title : 'Profile Account',
                                type  : 'basic',
                                link  : '/ealert/settings/profile'
                            },
                            {
                                id    : 'change-theme',
                                title : 'Change Theme',
                                type  : 'basic',
                                link  : '/ealert/settings/change-theme'
                            }
                        ]
                    },
                    {
                        id: 'logout',
                        title: 'Sign Out',
                        type: 'basic',
                        icon: 'heroicons_outline:logout',
                        function : ()=> {
                            Swal.fire({
                                title: 'Confirm Sign Out',
                                html: '<div class="text-md dark:text-gray-100">Are you sure you want to sign-out?</div>',
                                showCancelButton: true,
                                confirmButtonColor: '#1b357d',
                                width: 420,
                                imageUrl: '/assets/images/logo/DASH_BOARD_LOGO.png',
                                imageWidth: 200,
                                imageHeight: 110,
                                backdrop: 'rgba(0,0,0,0.5)',
                                buttonsStyling: false,
                                customClass: {
                                    title : 'text-xl font-semibold text-gray-900 dark:text-gray-100',
                                    popup : 'rounded-2xl mat-elevation-z8 dark:bg-gray-800',
                                    confirmButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-blue-800 hover:bg-blue-700 mr-1',
                                    cancelButton : 'text-sm font-semibold text-white py-2 w-20 rounded-md bg-red-600 hover:bg-red-700 ml-1'
                                },
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No'
                              }).then((result) => {
                                if (result.value) {
                                    window.location.href = '/auth/sign-in';
                                }
                              });
                        }
                    }
                ]
            };
        }else {                                                                                             
            menu = {
                id: 'menus',
                title: '',
                type     : 'group',
                children : []
            };
        }

    }
}

export const defaultNavigation: FuseNavigationItem[] = [menu];

export const compactNavigation: FuseNavigationItem[] = [menu];

export const futuristicNavigation: FuseNavigationItem[] = [menu];

export const horizontalNavigation: FuseNavigationItem[] = [menu];
