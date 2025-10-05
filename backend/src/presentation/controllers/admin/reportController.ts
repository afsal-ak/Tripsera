import { Request, Response, NextFunction } from "express";
import { IReportUseCases } from "@application/useCaseInterfaces/admin/IReportUseCases";
import { toReportResponseDTO, toReportSingleResponseDTO } from "@application/dtos/ReportDTO";
import { IFilter } from "@domain/entities/IFilter";
import { HttpStatus } from "@constants/HttpStatus/HttpStatus";

export class ReportController {
    constructor(private readonly _reportUseCases: IReportUseCases) { }

    getAllReports = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10

            const filters: IFilter = {
                search: (req.query.search as string) || "",
                status: (req.query.status as string) || "",
                sort: (req.query.sort as string) || "",
                startDate: (req.query.startDate as string) || "",
                endDate: (req.query.endDate as string) || "",
                customFilter: (req.query.customFilter as string) || "",
            }
            const { report, pagination } = await this._reportUseCases.getAllReports(page, limit, filters)
            const reports = report.map(toReportResponseDTO)
            res.status(HttpStatus.OK).json({
                reports,
                pagination,
                message: 'Report fetched successfully'
            })
        } catch (error) {
            next(error)
        }
    }

    getReportById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id
            const data = await this._reportUseCases.getById(id)
            const report = toReportSingleResponseDTO(data!)
             res.status(HttpStatus.OK).json({
                report,
                message: 'Report fetched successfully'
            })
        } catch (error) {
            next(error)
        }
    }



    updateReportStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const { status } = req.body

            const data = await this._reportUseCases.changeReportStatus(id, status);

            res.status(HttpStatus.OK).json({
                data,
                message: 'Report updated successfully'
            });
        } catch (error) {
            next(error);
        }
    }



}