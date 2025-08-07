import { Request, Response } from 'express';
import { HttpStatus } from 'constants/HttpStatus/HttpStatus';
import { ICouponUseCases } from '@application/useCaseInterfaces/user/ICouponUseCases';

export class CouponController {
  constructor(private couponUseCase: ICouponUseCases) {}

  getActiveCoupons = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;

      const { coupons, total } = await this.couponUseCase.getActiveCoupons(page, limit);

      res.status(200).json({
        coupons,
        total,
        message: 'Coupons fetched successfully',
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  applyCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code, totalAmount }: { code: string; totalAmount: number } = req.body;
      console.log(req.body, 'coupon apply');
      const discount = await this.couponUseCase.applyCoupon(code, totalAmount);

      res.status(HttpStatus.OK).json({
        success: true,
        discount,
        message: 'Coupon applied successfully',
      });
    } catch (error: any) {
      console.log(error.message, 'coupon error');
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        discount: 0,
        message: error.message,
      });
    }
  };
}
