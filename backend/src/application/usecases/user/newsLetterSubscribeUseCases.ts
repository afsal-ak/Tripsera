import { IUserRepository } from "@domain/repositories/IUserRepository";
import { INewsLetterSubscribeUseCases } from "@application/useCaseInterfaces/user/INewsLetterSubscribeUseCases";
import { UserMapper } from "@application/mappers/UserMapper";
import { UserBasicResponseDTO } from "@application/dtos/UserDTO";

export class NewsLetterSubscrice implements INewsLetterSubscribeUseCases {
    constructor(private readonly _userRepo: IUserRepository) { }

    async updateNewsletter(userId: string,subscribed:boolean):Promise<UserBasicResponseDTO|null> {
        const user = await this._userRepo.updateNewsletterSubscription(userId,subscribed);
        return user?UserMapper.toBasicResponse(user):null
    };

    
}
