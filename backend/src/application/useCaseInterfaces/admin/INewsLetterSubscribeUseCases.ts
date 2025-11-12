import { UserDetailsResponseDTO } from "@application/dtos/UserDTO";


export interface INewsLetterSubscribeUseCases{

     getAllNewsletterSubscribers(): Promise<UserDetailsResponseDTO[]>
   
}