import { Request, Response, NextFunction } from 'express';
import { IDashboardUseCases } from '@application/useCaseInterfaces/admin/IDashboardUseCases';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { DateFilter, IDateFilter } from '@application/dtos/DashboardDTO';
import {
  mapToTopPkgResponseDTO,
  mapToTopCategoryResponseDTO,
  mapToBookingChartResponseDTO,
} from '@application/dtos/DashboardDTO';

export class DashboardController {
  constructor(private readonly _dashboardUseCases: IDashboardUseCases) {}

  getDashboardSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { filter, startDate, endDate } = req.query;
       const dateRange: IDateFilter = {
        filter: filter as DateFilter,
        startDate: startDate as string,
        endDate: endDate as string,
      };

      const data = await this._dashboardUseCases.getDashboardSummary(dateRange);
       res.status(HttpStatus.OK).json({
        success: true,
        data,
        message: 'Dashboard summary fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getTopBookedPackages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { filter, startDate, endDate } = req.query;
       const dateRange: IDateFilter = {
        filter: filter as DateFilter,
        startDate: startDate as string,
        endDate: endDate as string,
      };
      const pkg = await this._dashboardUseCases.getTopBookedPackages(dateRange);
      const data = pkg.map(mapToTopPkgResponseDTO);
      res.status(HttpStatus.OK).json({
        success: true,
        data,
        message: 'Top packages fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getTopBookedCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { filter, startDate, endDate } = req.query;
       const dateRange: IDateFilter = {
        filter: filter as DateFilter,
        startDate: startDate as string,
        endDate: endDate as string,
      };
      const cat = await this._dashboardUseCases.getTopBookedCategories(dateRange);
      const data = cat.map(mapToTopCategoryResponseDTO);

      res.status(HttpStatus.OK).json({
        success: true,
        data,
        message: 'Top categories fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getBookingChart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { filter, startDate, endDate } = req.query;
 
      const dateRange: IDateFilter = {
        filter: filter as DateFilter,
        startDate: startDate as string,
        endDate: endDate as string,
      };
      const chart = await this._dashboardUseCases.getBookingsChartData(dateRange);
       const data = chart.map(mapToBookingChartResponseDTO);

      res.status(HttpStatus.OK).json({
        success: true,
        data,
        message: 'Booking Chart fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
