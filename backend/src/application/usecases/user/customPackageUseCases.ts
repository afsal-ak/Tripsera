import { CreateCustomPkgDTO, UpdateCustomPkgDTO } from "@application/dtos/CustomPkgDTO";
import { PaginationInfo } from "@application/dtos/PaginationDto";
import { INotificationUseCases } from "@application/useCaseInterfaces/notification/INotificationUseCases";
import { ICustomPkgUseCases } from "@application/useCaseInterfaces/user/ICustomPackageUseCases";
import { ICustomPackage } from "@domain/entities/ICustomPackage";
import { IFilter } from "@domain/entities/IFilter";
import { ICustomPackageRepository } from "@domain/repositories/ICustomPackageRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";

export class CustomPackageUseCases implements ICustomPkgUseCases {
    constructor(
        private readonly _customPkgRepo: ICustomPackageRepository,
        private readonly _userRepo: IUserRepository,
        private readonly _notificationUseCases: INotificationUseCases,
    ) { }

    async createCutomPkg(data: CreateCustomPkgDTO): Promise<ICustomPackage> {
        const customPkg = await this._customPkgRepo.create(data)

        const userId = customPkg.userId?.toString()
        const user = await this._userRepo.findById(userId!)
        let message = `User ${user?.username} requested for custom package .`

        const notification = await this._notificationUseCases.sendNotification({
            role: 'admin',
            title: "Custom Package",
            entityType: 'customPacakage',
            customPackageId: customPkg._id?.toString(),
            message,
            type: "request",
            triggeredBy: userId,
        });

        return customPkg
    }

    async updateCutomPkg(customPkgId: string, userId: string, data: UpdateCustomPkgDTO): Promise<ICustomPackage | null> {
        const pkg = await this._customPkgRepo.updateByFilter({ _id: customPkgId, userId }, data)
        return pkg ? pkg : null

    }

    async getCustomPkgById(customPkgId: string): Promise<ICustomPackage | null> {
        return await this._customPkgRepo.findById(customPkgId)
    }

    async getAllCustomPkg(userId: string, page: number, limit: number, filters?: IFilter
    ): Promise<{ data: ICustomPackage[]; pagination: PaginationInfo; }> {
        return await this._customPkgRepo.findAll(page, limit, { userId })
    }

    async deleteCustomPkg(customPkgId: string, userId: string): Promise<boolean> {
        return await this._customPkgRepo.deleteByFilter({ _id: customPkgId, userId })
    }
}