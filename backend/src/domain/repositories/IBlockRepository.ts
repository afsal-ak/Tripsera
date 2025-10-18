import { IBlock } from '@domain/entities/IBlock';

export interface IBlockRepository {
  blockUser(blockerId: string, blockedId: string, reason?: string): Promise<IBlock>;
  unblockUser(blockerId: string, blockedId: string): Promise<boolean>;
  isBlocked(blockerId: string, blockedId: string): Promise<boolean>;
  getBlockedUsers(userId: string): Promise<IBlock[]>;
}
