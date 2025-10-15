import { CreateReportDTO } from "@application/dtos/ReportDTO";
import { IReportUseCases } from "@application/useCaseInterfaces/user/IReportUseCases";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";
import { IReport } from "@domain/entities/IReport";
import { IReportRepository } from "@domain/repositories/IReportRepository";
import { AppError } from "@shared/utils/AppError";
import { INotificationUseCases } from "@application/useCaseInterfaces/notification/INotificationUseCases";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IReviewRepository } from "@domain/repositories/IReviewRepository";
import { IBlogRepository } from "@domain/repositories/IBlogRepository";
import { EnumUserRole } from "@constants/enum/userEnum";
export class ReportUseCases implements IReportUseCases {
    constructor(
        private readonly _reportRepo: IReportRepository,
        private readonly _userRepo: IUserRepository,
        private readonly _reviewRepo: IReviewRepository,
        private readonly _blogRepo: IBlogRepository,
        private readonly _notificationUseCases: INotificationUseCases,

    ) { }

    async createReport(data: CreateReportDTO): Promise<IReport> {
        const { reportedId, reporterId } = data
        const existingReport = await this._reportRepo.existingReport(reportedId, reporterId)
        if (existingReport) {
            throw new AppError(HttpStatus.CONFLICT, 'This content has already been reported by you')
        }



        const report = await this._reportRepo.create(data)
        const reporter = await this._userRepo.findById(report.reporterId.toString())
       
        let message
        if (report.reportedType == 'user') {
            const reportedUser = await this._userRepo.findById(report.reportedId.toString())
            message = `User ${reportedUser?.username} has been reported by ${reporter?.username}.`

        } else if (report.reportedType == 'review') {
            const reportedReview = await this._reviewRepo.findById(report.reportedId.toString())
            message = `Review :${reportedReview?.username} has been reported by ${reporter?.username}.`
        } else if (report.reportedType == 'blog') {
            const reportedBlog = await this._blogRepo.findById(report.reportedId.toString())
            message = `Blog :${reportedBlog?.title} Blog has been reported by ${reporter?.username}.`
        }
        const notification = await this._notificationUseCases.sendNotification({
            role:EnumUserRole.ADMIN,
            title: "New Report",
            entityType: 'report',
            reportedId: report?._id!?.toString(),
            message,
            type: "warning",
            triggeredBy: report.reporterId.toString(),
        });

        return report
    }



}