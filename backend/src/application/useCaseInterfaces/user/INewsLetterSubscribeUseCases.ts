import { UserBasicResponseDTO } from "@application/dtos/UserDTO" 


export interface INewsLetterSubscribeUseCases {
       updateNewsletter(userId: string,subscribed:boolean):Promise<UserBasicResponseDTO|null>  

 
}