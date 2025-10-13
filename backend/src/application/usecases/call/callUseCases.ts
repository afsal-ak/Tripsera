import { ICallRepository } from "@domain/repositories/ICallRepository";
import { ICall } from "@domain/entities/ICall";
import { ICallUseCases } from "@application/useCaseInterfaces/call/ICallUseCases";

export class CallUseCases implements ICallUseCases {
  constructor(private readonly _callRepo: ICallRepository) {}

  async createCall(data: Partial<ICall>): Promise<ICall> {
        console.log(data,'created')

    return await this._callRepo.createCall(data);
  }

  async markAnswered(callId: string): Promise<ICall | null> {
    console.log(callId,'ansered')
    return await this._callRepo.updateCallStatus(callId, "answered");
  }

  async markEnded(callId: string): Promise<ICall | null> {
    return await this._callRepo.updateCallStatus(callId, "ended", new Date());
  }

  async markMissed(callId: string): Promise<ICall | null> {
        console.log(callId,'missed')

    return await this._callRepo.updateCallStatus(callId, "missed");
  }

  async getUserCalls(userId: string): Promise<ICall[]> {
    return await this._callRepo.getUserCalls(userId);
  }
}
