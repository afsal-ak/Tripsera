import { ICouponRepository } from '@domain/repositories/ICouponRepository';
import { ICouponUseCases } from '@application/useCaseInterfaces/admin/ICouponUseCases';
import { CreateCouponDTO, UpdateCouponDTO, CouponResponseDTO } from '@application/dtos/CouponDTO';
import { CouponMapper } from '@application/mappers/CouponMapper';

export class CouponUseCases implements ICouponUseCases {

  constructor(private _couponRepo: ICouponRepository) { }

  async createCoupon(data: CreateCouponDTO): Promise<CouponResponseDTO> {
    const coupon = await this._couponRepo.createCoupon(data);
    return CouponMapper.toResponseDTO(coupon)

  }

  async editCoupon(id: string, couponData: UpdateCouponDTO): Promise<CouponResponseDTO | null> {
    const coupon = await this._couponRepo.editCoupon(id, couponData);
    return coupon ? CouponMapper.toResponseDTO(coupon) : null

  }

  async getAllCoupon(page: number, limit: number): Promise<{ coupons: CouponResponseDTO[]; total: number }> {
    const result = await this._couponRepo.getAllCoupons(page, limit);
    return {
      coupons: result.coupons.map(CouponMapper.toResponseDTO),
      total: result.total
    }
  }

  async getCouponById(id: string): Promise<CouponResponseDTO | null> {
    const coupon = await this._couponRepo.getCouponById(id);
    return coupon ? CouponMapper.toResponseDTO(coupon) : null

  }
  async getCouponByCode(code: string): Promise<CouponResponseDTO | null> {
    const coupon = await this._couponRepo.getCouponByCode(code);
    return coupon ? CouponMapper.toResponseDTO(coupon) : null

  }

  async updateCouponStatus(id: string, isActive: boolean): Promise<void> {
    return this._couponRepo.updateCouponStatus(id, isActive);
  }

  async deleteCoupon(id: string): Promise<void> {
    return this._couponRepo.deleteCoupon(id);
  }
}
