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
    findAll():Promise<IPackage[]>
    delete(id: string): Promise<void>;
    block(id:string):Promise<void>
    unblock(id:string):Promise<void>


}