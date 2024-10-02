export interface User
{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status?: string;
    username?: string;
    fname?: string;
    lname?: string;
    locked?: string;
    failedCount?: number;
    successCount?: number;
    dateCreated?: string;
    phoneNumber?: string;
    emailAddress?: string;
    authStat?: string;
    roleId?: string;
    lastLogin?: string;
    loginCount?: number;
    loginStat?: number;
    branch?: number;
}
