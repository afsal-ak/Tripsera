import { ICouponRepository } from '@domain/repositories/ICouponRepository';
import { ICoupon } from '@domain/entities/ICoupon';
import { CouponModel } from '@infrastructure/models/Coupon';

export class CouponRepository implements ICouponRepository {
  async createCoupon(couponData: ICoupon): Promise<ICoupon> {
    const isCodeExiting = await CouponModel.findOne({
      code: new RegExp(`^${couponData.code}$`, 'i'),
    });
    if (isCodeExiting) {
      throw new Error('Coupon Code already exists');
    }
    const newCoupon = await CouponModel.create(couponData);
    return newCoupon.toObject();
  }

  async getAllCoupons(page: number, limit: number): Promise<{ coupons: ICoupon[]; total: number }> {
    const skip = (page - 1) * limit;

    const [coupons, total] = await Promise.all([
      CouponModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),

      CouponModel.countDocuments(),
    ]);

    return { coupons, total };
  }
  async getActiveCoupons(
    page: number,
    limit: number
  ): Promise<{ coupons: ICoupon[]; total: number }> {
    const skip = (page - 1) * limit;
    const now = new Date();

    const [coupons, total] = await Promise.all([
      CouponModel.find({
        isActive: true,
        $or: [{ expiryDate: { $gte: now } }, { expiryDate: { $exists: false } }],
      })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      CouponModel.countDocuments({
        isActive: true,
        $or: [{ expiryDate: { $gte: now } }, { expiryDate: { $exists: false } }],
      }),
    ]);

    return { coupons, total };
  }

  async getCouponById(id: string): Promise<ICoupon | null> {
    const coupon = await CouponModel.findById(id);
    return coupon ? coupon.toObject() : null;
  }

  async getCouponByCode(code: string): Promise<ICoupon | null> {
    return await CouponModel.findOne({ code: code });
  }
  async editCoupon(id: string, couponData: Partial<ICoupon>): Promise<ICoupon | null> {
    if (couponData.code) {
      const isCodeExiting = await CouponModel.findOne({
        _id: { $ne: id },
        code: new RegExp(`^${couponData.code}$`, 'i'),
      });
      if (isCodeExiting) {
        throw new Error('Coupon Code already exists');
      }
    }
    const updatedCoupon = await CouponModel.findByIdAndUpdate(id, couponData, {
      new: true,
      runValidators: true,
    }).lean();

    return updatedCoupon;
  }

  async updateCouponStatus(id: string, isActive: boolean): Promise<void> {
    await CouponModel.findByIdAndUpdate(id, { isActive });
  }

  async deleteCoupon(id: string): Promise<void> {
    await CouponModel.findByIdAndDelete(id);
  }
}
