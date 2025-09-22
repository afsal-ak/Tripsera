import { IBlockUseCase } from "@application/useCaseInterfaces/user/IBlockUseCases";
import { IBlockRepository } from "@domain/repositories/IBlockRepository";
import { CreateBlockDTO, BlockResponseDTO,toBlockResponseDTO } from "@application/dtos/BlockDTO";

export class BlockUseCase implements IBlockUseCase {
  constructor(private blockRepo: IBlockRepository) {}

  async blockUser(blockerId: string, data: CreateBlockDTO): Promise<BlockResponseDTO> {
    const block = await this.blockRepo.blockUser(blockerId, data.blockedId, data.reason);
    return toBlockResponseDTO(block);
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<boolean> {
    return await this.blockRepo.unblockUser(blockerId, blockedId);
  }

  async isBlocked(blockerId: string, blockedId: string): Promise<boolean> {
    return await this.blockRepo.isBlocked(blockerId, blockedId);
  }

  async getBlockedUsers(userId: string): Promise<BlockResponseDTO[]> {
    const blockedList = await this.blockRepo.getBlockedUsers(userId);
    return blockedList.map(toBlockResponseDTO);
  }
}
