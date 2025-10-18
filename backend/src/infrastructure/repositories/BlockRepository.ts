import { IBlockRepository } from '@domain/repositories/IBlockRepository';
import { IBlock } from '@domain/entities/IBlock';
import { BlockModel } from '@infrastructure/models/Block';

export class BlockRepository implements IBlockRepository {
  async blockUser(blockerId: string, blockedId: string, reason?: string): Promise<IBlock> {
    const block = await BlockModel.findOneAndUpdate(
      { blocker: blockerId, blocked: blockedId },
      { reason, unblockedAt: null }, // reset if re-blocked
      { upsert: true, new: true }
    );
    return block;
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<boolean> {
    const res = await BlockModel.findOneAndUpdate(
      { blocker: blockerId, blocked: blockedId },
      { unblockedAt: new Date() }
    );
    return !!res;
  }

  async isBlocked(blockerId: string, blockedId: string): Promise<boolean> {
    const block = await BlockModel.findOne({
      blocker: blockerId,
      blocked: blockedId,
      unblockedAt: null, // still active
    });
    return !!block;
  }

  async getBlockedUsers(userId: string): Promise<IBlock[]> {
    return await BlockModel.find({ blocker: userId, unblockedAt: null })
      .populate('blocked', '_id username email profileImage')
      .exec();
  }
}
