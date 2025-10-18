import { Request, Response, NextFunction } from 'express';
import { IReferralUseCases } from '@application/useCaseInterfaces/admin/IReferralUserCases';
import { UpdateReferralDTO } from '@application/dtos/ReferralDto';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';

export class ReferralController {
  constructor(private _referralUseCase: IReferralUseCases) {}

  saveReferralSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: UpdateReferralDTO = req.body;
      const referral = await this._referralUseCase.upsertReferral(data);
      res.status(HttpStatus.CREATED).json({
        referral,
        message: 'Referral settings saved successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getReferral = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this._referralUseCase.getReferral();

      res.status(HttpStatus.OK).json({
        referral: data,
        message: 'Referral fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getReferralById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const referralId = req.params.referralId;
      console.log(referralId, 'referralId');

      const referral = await this._referralUseCase.getReferralById(referralId);
      console.log(referral, 'referral');
      res.status(HttpStatus.OK).json({
        referral: referral,
        message: 'Referral fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  deleteReferral = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const referralId = req.params.referralId;
      const result = await this._referralUseCase.deleteReferral(referralId);
      res.status(HttpStatus.OK).json({
        result,
        message: 'referral deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  changeReferralStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const referralId = req.params.referralId;
      const { status } = req.body;
      console.log({ status }, 'status');
      const result = await this._referralUseCase.changeReferralStatus(referralId, status);
      res.status(HttpStatus.OK).json({
        result,
        message: 'referral status successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
