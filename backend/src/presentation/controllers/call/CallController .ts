import { Request, Response } from "express";
import { ICallUseCases } from "@application/useCaseInterfaces/call/ICallUseCases";


export class CallController {
  constructor(private readonly _callUseCases: ICallUseCases) {}

  async create(req: Request, res: Response) {
    try {
      const { callerId, receiverId, roomId, callType } = req.body;
      const call = await this._callUseCases.createCall({
        callerId,
        receiverId,
        roomId,
        callType,
        startedAt: new Date(),
      });
      res.status(201).json(call);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async getUserCalls(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const calls = await this._callUseCases.getUserCalls(userId);
      res.json(calls);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}
