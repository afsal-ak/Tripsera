import { CreateReportDTO } from "@application/dtos/ReportDTO";
import { IReportUseCases } from "@application/useCaseInterfaces/user/IReportUseCases";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";
import { IReport } from "@domain/entities/IReport";
import { IReportRepository } from "@domain/repositories/IReportRepository";
import { AppError } from "@shared/utils/AppError";
import { INotificationUseCases } from "@application/useCaseInterfaces/notification/INotificationUseCases";
export class ReportUseCases implements IReportUseCases {
    constructor(
        private readonly _reportRepo: IReportRepository,
        private readonly _notificationUseCases: INotificationUseCases,

    ) { }

    async createReport(data: CreateReportDTO): Promise<IReport> {
        const { reportedId, reporterId } = data
        const existingReport = await this._reportRepo.existingReport(reportedId, reporterId)
        if (existingReport) {
            throw new AppError(HttpStatus.CONFLICT, 'This content has already been reported by you')
        }



        const report = await this._reportRepo.create(data)

       // const findReport=await this._reportRepo.findById(report._id!)

        // const notification = await this._notificationUseCases.sendNotification({

        //     role: 'admin',
        //     title: "New Report",
        //     entityType: 'report',
        //     reportedId: report?._id!?.toString(),
        //     packageId: report?.reportedId.toString(),
        //     //message: `User ${userId} booked package ${packageId}`,
        //     type: "success",
        //     triggeredBy: report.reporterId.toString(),
           
        // });

        return report
    }



}