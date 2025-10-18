import { Request, Response, NextFunction } from 'express';
import { IReportUseCases } from '@application/useCaseInterfaces/user/IReportUseCases';
import { CreateReportDTO } from '@application/dtos/ReportDTO';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { getUserIdFromRequest } from '@shared/utils/getUserIdFromRequest';

export class ReportController {
  constructor(private readonly _reportUseCases: IReportUseCases) {}

  createReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reporterId = getUserIdFromRequest(req);
      const reportedId = req.params.reportedId;
      const data: CreateReportDTO = {
        reporterId,
        reportedId,
        ...req.body,
      };
      console.log(data, 'report data');
      const report = await this._reportUseCases.createReport(data);

      res.status(HttpStatus.CREATED).json({
        succes: true,
        report,
        message: 'Report created succesffully',
      });
    } catch (error) {
      next(error);
    }
  };
}
