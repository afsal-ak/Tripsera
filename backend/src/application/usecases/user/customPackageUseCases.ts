import { CreateCustomPkgDTO,UpdateCustomPkgDTO, CustomPkgResponseDTO,CustomPkgUserListDTO } from "@application/dtos/CustomPkgDTO";
import { IPaginatedResult } from "@domain/entities/IPaginatedResult";
import { INotificationUseCases } from "@application/useCaseInterfaces/notification/INotificationUseCases";
import { ICustomPkgUseCases } from "@application/useCaseInterfaces/user/ICustomPackageUseCases";
 import { IFilter } from "@domain/entities/IFilter";
import { ICustomPackageRepository } from "@domain/repositories/ICustomPackageRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { CustomPkgMapper } from "@application/mappers/CustomPkgMapper";
import { EnumUserRole } from "@constants/enum/userEnum";
import { EnumNotificationEntityType, EnumNotificationType } from "@constants/enum/notificationEnum";

export class CustomPackageUseCases implements ICustomPkgUseCases {
    constructor(
        private readonly _customPkgRepo: ICustomPackageRepository,
        private readonly _userRepo: IUserRepository,
        private readonly _notificationUseCases: INotificationUseCases,
    ) { }


    async createCutomPkg(data: CreateCustomPkgDTO): Promise<CustomPkgResponseDTO> {

        const customPkg = await this._customPkgRepo.create(data)

        const userId = customPkg.userId?.toString()
        const user = await this._userRepo.findById(userId!)
        let message = `User ${user?.username} requested for custom package .`

        const notification = await this._notificationUseCases.sendNotification({
            role: EnumUserRole.ADMIN,
            title: "Custom Package",
            entityType: EnumNotificationEntityType.CUSTOM_PACKAGE,
            customPackageId: customPkg._id?.toString(),
            message,
            type: EnumNotificationType.REQUEST,
            triggeredBy: userId,
        });

        return CustomPkgMapper.toResponseDTO(customPkg)
    }

    async updateCutomPkg(customPkgId: string, userId: string, data: UpdateCustomPkgDTO): Promise<CustomPkgResponseDTO | null> {
        const pkg = await this._customPkgRepo.updateByFilter({ _id: customPkgId, userId }, data)
        return pkg ? CustomPkgMapper.toResponseDTO(pkg) : null

    }

    async getCustomPkgById(customPkgId: string): Promise<CustomPkgResponseDTO | null> {
        const pkg = await this._customPkgRepo.findById(customPkgId)
        return CustomPkgMapper.toResponseDTO(pkg!)
    }


    async getAllCustomPkg(userId: string, page: number, limit: number, filters?: IFilter
    ): Promise<IPaginatedResult<CustomPkgUserListDTO>> {
        const result = await this._customPkgRepo.findAll(page, limit, { userId })
        return {
            pagination: result.pagination,
            data: result.data.map(CustomPkgMapper.toUserListDTO)
        }
    }

    async deleteCustomPkg(customPkgId: string, userId: string): Promise<boolean> {
        return await this._customPkgRepo.deleteByFilter({ _id: customPkgId, userId })
    }
}