import { Request, Response } from 'express';
import { CouponUseCases } from '@application/usecases/admin/couponUseCases';
import { ICoupon } from '@domain/entities/ICoupon';

export class CouponController {
  constructor(private couponUseCase: CouponUseCases) {}

  createCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const couponData: ICoupon = req.body;
      console.log(req.body, 'coupon data');
      const coupon = await this.couponUseCase.createCoupon(couponData);
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
      const coupon = await this.couponUseCase.getCouponById(id);
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
      const coupon = await this.couponUseCase.editCoupon(id, couponData);
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

      const { coupons, total } = await this.couponUseCase.getAllCoupon(page, limit);
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

      await this.couponUseCase.updateCouponStatus(id, isActive);

      res.status(200).json({ message: 'coupon status updated successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  deleteCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.couponUseCase.deleteCoupon(id);
      res.status(200).json({ message: 'coupon deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
