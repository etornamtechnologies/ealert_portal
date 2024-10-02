/**
 * Created by Emmanuel on 10/27/2018.
 */
export interface LoggedInUser {
    token       : string;
    user        : any;
}

export interface CurrentUser {
    id       : number;
    name     : string;
    email    : string;
    roleId   : number,
    role     : any;
    location : any;
    username : string;
    isDefaultPassword: string;
}

export interface UserCredentials {
    username : string;
    password : string;
}
