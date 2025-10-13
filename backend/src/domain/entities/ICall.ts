import { Types } from "mongoose";

export interface ICall {
    _id?: Types.ObjectId | string;

    callerId: Types.ObjectId | string;
    receiverId: Types.ObjectId | string;
    roomId: Types.ObjectId | string;
    callType: "audio" | "video";
    status: "initiated" | "answered" | "missed" | "ended";
    startedAt?: Date;
    endedAt?: Date;
    duration?: number;
}