import { NextFunction, Request, Response } from 'express';
import { SalesReportUseCase } from '@application/usecases/admin/salesReportUseCase';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';

export class SalesReportController {
    constructor(private salesReportUseCase: SalesReportUseCase) { }

    getReportList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const filters = {
                status: req.query.status as string,
                paymentMethod: req.query.paymentMethod as string,
                from: req.query.from as string,
                to: req.query.to as string,
                day: req.query.day as string,
                week: req.query.week as string,
                month: req.query.month as string,
                year: req.query.year as string,
            };


            const result = await this.salesReportUseCase.getReportList(filters, page, limit);

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Sales report fetched successfully',
                ...result
            });
        } catch (error) {
            next(error)
        }
    };

    downloadExcel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filters = {
                status: req.query.status as string,
                paymentMethod: req.query.paymentMethod as string,
                from: req.query.from as string,
                to: req.query.to as string,
                day: req.query.day as string,
                week: req.query.week as string,
                month: req.query.month as string,
                year: req.query.year as string,
            };


            const buffer = await this.salesReportUseCase.downloadExcel(filters);

            res.setHeader('Content-Disposition', 'attachment; filename="sales-report.xlsx"');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.status(HttpStatus.OK).send(buffer);
        } catch (error) {
            next(error)

        }
    };
}
