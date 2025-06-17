export interface IUser{
    _id:string;
    username?:string;
    email?:string;
    isBlocked:boolean;
    role:"user"|"admin"
}
