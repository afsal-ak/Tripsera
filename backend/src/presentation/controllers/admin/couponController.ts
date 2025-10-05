import { NextFunction, Request, Response } from 'express';
import { ICoupon } from '@domain/entities/ICoupon';
import { ICouponUseCases } from '@application/useCaseInterfaces/admin/ICouponUseCases';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';

export class CouponController {

  constructor(private _couponUseCase: ICouponUseCases) { }

  createCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const couponData: ICoupon = req.body;
      const coupon = await this._couponUseCase.createCoupon(couponData);
      res.status(HttpStatus.CREATED).json({
        coupon,
        message: 'coupon created successfully',
      });
    } catch (error: any) {
     next(error)
    }
  };

  getCouponById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const coupon = await this._couponUseCase.getCouponById(id);
      res.status(HttpStatus.OK).json({
        coupon,
        message: 'coupon fetched successfully',
      });
    } catch (error) {
      next(error)
    }
  };

  editCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const couponData: Partial<ICoupon> = req.body;
      const coupon = await this._couponUseCase.editCoupon(id, couponData);
      res.status(HttpStatus.OK).json({
        coupon,
        message: 'coupon created successfully',
      });
    } catch (error) {
      next(error)
    }
  };

  getAllCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;

      const { coupons, total } = await this._couponUseCase.getAllCoupon(page, limit);
      res.status(HttpStatus.OK).json({
        coupons,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        message: 'coupon fetched successfully',
      });
    } catch (error) {
      next(error)
    }
  };

  updateCouponStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      await this._couponUseCase.updateCouponStatus(id, isActive);

      res.status(HttpStatus.OK).json({ message: 'coupon status updated successfully' });
    } catch (error) {
      next(error)
    }
  };

  deleteCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this._couponUseCase.deleteCoupon(id);
      res.status(HttpStatus.OK).json({ message: 'coupon deleted successfully' });
    } catch (error) {
      next(error)
    }
  };
}
