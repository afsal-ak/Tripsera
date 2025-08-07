import { Request, Response } from 'express';
import { ICoupon } from '@domain/entities/ICoupon';
import { ICouponUseCases } from '@application/useCaseInterfaces/admin/ICouponUseCases';

export class CouponController {

  constructor(private _couponUseCase: ICouponUseCases) {}

  createCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const couponData: ICoupon = req.body;
      console.log(req.body, 'coupon data');
      const coupon = await this._couponUseCase.createCoupon(couponData);
      res.status(201).json({
        coupon,
        message: 'coupon created successfully',
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  getCouponById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const coupon = await this._couponUseCase.getCouponById(id);
      res.status(200).json({
        coupon,
        message: 'coupon fetched successfully',
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  editCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const couponData: Partial<ICoupon> = req.body;
      const coupon = await this._couponUseCase.editCoupon(id, couponData);
      res.status(200).json({
        coupon,
        message: 'coupon created successfully',
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  getAllCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;

      const { coupons, total } = await this._couponUseCase.getAllCoupon(page, limit);
      res.status(200).json({
        coupons,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        message: 'coupon fetched successfully',
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  updateCouponStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      await this._couponUseCase.updateCouponStatus(id, isActive);

      res.status(200).json({ message: 'coupon status updated successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  deleteCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this._couponUseCase.deleteCoupon(id);
      res.status(200).json({ message: 'coupon deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
