 import { IMessage } from "@domain/entities/IMessage";
import { IUserBasic } from "./IUserBasic";

export interface IMessagePopulated extends Omit<IMessage, "senderId"> {
  senderId:IUserBasic
}
