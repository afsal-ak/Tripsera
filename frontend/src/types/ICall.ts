export interface ICall {
  _id?: string;

  callerId: string;
  receiverId: string;
  roomId: string;
  callType: 'audio' | 'video';
  status: 'initiated' | 'answered' | 'missed' | 'ended';
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;

  duration?: number;
}
