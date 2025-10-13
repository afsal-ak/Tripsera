import { ICall } from "@domain/entities/ICall";

export interface ICallUseCases {

    createCall(data: Partial<ICall>): Promise<ICall>


    markAnswered(callId: string): Promise<ICall | null>


    markEnded(callId: string): Promise<ICall | null>


    markMissed(callId: string): Promise<ICall | null>


    getUserCalls(userId: string): Promise<ICall[]>

}
