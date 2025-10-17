 
export interface CreateBannerDTO {
  title: string;
  description?: string;
  image: {
    url: string;
    public_id: string;
  };
}

export interface UpdateBannerDTO extends Partial<CreateBannerDTO> {
  bannerId: string;
  isBlocked?: boolean;
}

export interface BannerResponseDTO {
  _id: string;
  title: string;
  description?: string;
  image: {
    url: string;
    public_id: string;
  };
  isBlocked: boolean;
}
