import { IPackage } from "@domain/entities/IPackage";

export interface IPackageRepository{
    create(pkg:IPackage):Promise<IPackage>
    //editPackage(id:string,data:Partial<IPackage>):Promise<IPackage|null>
    editPackage(
    id: string,
    data: Partial<IPackage>,
    deletedImages?: { public_id: string }[],
    newImages?: { url: string; public_id: string }[]
  ): Promise<IPackage | null>;

    findById(id:string):Promise<IPackage|null>
    findAll(skip:number,limit:number):Promise<IPackage[]>
    countDocument():Promise<number>
    getActivePackages(filters:any,skip:number,limit:number,sort:any):Promise<IPackage[]>
    countActivePackages(filters: any): Promise<number>;

    delete(id: string): Promise<void>;
    block(id:string):Promise<void>
    unblock(id:string):Promise<void>
    getHomeData():Promise<IPackage[]>

}