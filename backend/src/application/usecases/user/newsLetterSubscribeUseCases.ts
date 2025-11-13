import { IUserRepository } from "@domain/repositories/IUserRepository";
import { INewsLetterSubscribeUseCases } from "@application/useCaseInterfaces/user/INewsLetterSubscribeUseCases";
import { UserMapper } from "@application/mappers/UserMapper";
import { UserBasicResponseDTO } from "@application/dtos/UserDTO";
import { IDashboardRepository } from "@domain/repositories/IDashboardRepository";
import { PackageMapper } from "@application/mappers/PackageMapper";
import { sendTopPackagesMail } from "@infrastructure/services/mail/sendTopPackagesMail";

export class NewsLetterSubscriceUseCases implements INewsLetterSubscribeUseCases {
    constructor(
        private readonly _userRepo: IUserRepository,
        private readonly _dashboardRepo: IDashboardRepository
    ) { }

    async updateNewsletter(userId: string, subscribed: boolean): Promise<UserBasicResponseDTO | null> {
        const user = await this._userRepo.updateNewsletterSubscription(userId, subscribed);
        console.log('user subscri', user);


        return user ? UserMapper.toBasicResponse(user) : null
    };


    async sendWeeklyTopPackagesNewsletter(): Promise<void> {
        const topPackages = await this._dashboardRepo.getTopBookedPackagesForUser(5);
        const packagesForEmail = topPackages.map(item =>
            PackageMapper.toCardDTO(item.packageDetails)
        );

         const subscribers = await this._userRepo.getAllNewsletterSubscribers();
        for (const user of subscribers) {
            await sendTopPackagesMail(user.email, packagesForEmail);
        }
    }
}
