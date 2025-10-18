export interface CreateReferralDTO {
  amount: number;
}

export interface UpdateReferralDTO {
  _id: string;
  amount: number;
  isBlocked?: boolean;
}

export interface ReferralResponseDTO {
  _id: string;
  amount: number;
  isBlocked: boolean;
}
