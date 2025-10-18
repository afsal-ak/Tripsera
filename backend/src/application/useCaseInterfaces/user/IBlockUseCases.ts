import { CreateBlockDTO, BlockResponseDTO } from '@application/dtos/BlockDTO';

export interface IBlockUseCase {
  blockUser(blockerId: string, data: CreateBlockDTO): Promise<BlockResponseDTO>;
  unblockUser(blockerId: string, blockedId: string): Promise<boolean>;
  isBlocked(blockerId: string, blockedId: string): Promise<boolean>;
  getBlockedUsers(userId: string): Promise<BlockResponseDTO[]>;
}
