import { IBlock } from "@domain/entities/IBlock";

export interface CreateBlockDTO {
  blockedId: string;
  reason?: string;
}

export interface BlockResponseDTO {
  _id: string;
  blockerId: string;
  blockedId: string;
  reason?: string;
  createdAt: Date;
  unblockedAt?: Date | null;
}
 
export const toBlockResponseDTO = (block: IBlock): BlockResponseDTO => ({
  _id: block._id!.toString(),
  blockerId: block.blocker.toString(),
  blockedId: block.blocked.toString(),
  reason: block.reason,
  createdAt: block.createdAt!,
  unblockedAt: block.unblockedAt ?? null,
});