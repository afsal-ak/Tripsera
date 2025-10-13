import { ICall } from "@domain/entities/ICall";

export interface ICallRepository {
  createCall(data: Partial<ICall>): Promise<ICall>;
  updateCallStatus(callId: string, status: string, endedAt?: Date): Promise<ICall | null>;
  getUserCalls(userId: string): Promise<ICall[]>;
  getUserCallByRoom(roomId: string): Promise<ICall[]>;
}
