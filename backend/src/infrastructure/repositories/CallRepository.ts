import { ICallRepository } from "@domain/repositories/ICallRepository";
import { ICall } from "@domain/entities/ICall";
import { CallModel } from "@infrastructure/models/Call";


export class CallRepository implements ICallRepository {
    
  async createCall(data: Partial<ICall>): Promise<ICall> {
    return await CallModel.create(data);
  }

  async updateCallStatus(callId: string, status: string, endedAt?: Date): Promise<ICall | null> {
    const update: any = { status };
    if (endedAt) update.endedAt = endedAt;

    return await CallModel.findByIdAndUpdate(callId, update, { new: true });
  }

  async getUserCalls(userId: string): Promise<ICall[]> {
    return await CallModel.find({
      $or: [{ callerId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });
  }

  async getUserCallByRoom(roomId: string): Promise<ICall[]> {
    return await CallModel.find({roomId})
  }
}
