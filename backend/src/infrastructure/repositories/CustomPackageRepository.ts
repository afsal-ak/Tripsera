import CustomPackage from "@infrastructure/models/CustomPackage";
import { ICustomPackageRepository } from "@domain/repositories/ICustomPackageRepository";
import { ICustomPackage } from "@domain/entities/ICustomPackage";
import { BaseRepository } from "./BaseRepository";
import { IFilter } from "@domain/entities/IFilter";
import { PaginationInfo } from "@application/dtos/PaginationDto";
import { SortOrder } from "mongoose";
import { UpdateCustomPkgStatusDTO } from "@application/dtos/CustomPkgDTO";
export class CustomPackageRepository extends BaseRepository<ICustomPackage> implements ICustomPackageRepository {
    constructor() {
        super(CustomPackage)
    }

    async getAllCustomPkgs(
        page: number,
        limit: number,
        filters?: IFilter
    ): Promise<{ data: ICustomPackage[]; pagination: PaginationInfo }> {
        const skip = (page - 1) * limit;

        const query: any = {};

        if (filters?.search) {
            query.$or = [
                { username: { $regex: filters.search, $options: "i" } },
            ];
        }

        if (filters?.status) {
            query.status = filters.status
        }

        if (filters?.startDate && filters?.endDate) {
            query.createdAt = {
                $gte: new Date(filters.startDate),
                $lte: new Date(filters.endDate)
            };
        }

        const sortOption: Record<string, SortOrder> = {}

        if (filters?.sort === 'desc') {
            sortOption.createdAt = -1;
        } else if (filters?.sort === 'asc') {
            sortOption.createdAt = 1;
        }
        const [data, total] = await Promise.all([
            CustomPackage.find(query)
                .populate({
                    path: 'userId',
                    select: 'username email profileImage.url  ',
                })
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .lean(),
            CustomPackage.countDocuments(query),
        ]);

        const pagination: PaginationInfo = {
            totalItems: total,
            currentPage: page,
            pageSize: limit,
            totalPages: Math.ceil(total / limit),
        };

        return { data, pagination };
    }


    async changeStatusAndResponse(
        pkgId: string,
        data: UpdateCustomPkgStatusDTO
    ): Promise<ICustomPackage | null> {
        return await CustomPackage.findByIdAndUpdate(pkgId, { $set: data }, { new: true });
    }

}