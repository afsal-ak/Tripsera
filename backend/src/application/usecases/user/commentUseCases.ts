import { ICommentRepository } from '@domain/repositories/ICommentRepository';
import { CommentResponseDTO, CreateCommentDto, ReplyCommentDto, UpdateCommentDto } from '@application/dtos/CommentDTO';
import { IComment } from '@domain/entities/IComment';
import { ICommentUseCases } from '@application/useCaseInterfaces/user/ICommentUseCases';
import { toCommentResponseDTO ,toCommentResponseWithReplyCountDTO} from '@application/mappers/commentMapper';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
export class CommentUseCases implements ICommentUseCases {
    constructor(private _commentRepo: ICommentRepository) { }

    async createComment(data: CreateCommentDto): Promise<CommentResponseDTO> {
        const comment = await this._commentRepo.create(data);
        return toCommentResponseDTO(comment)
    }
    async replyComment(data: ReplyCommentDto): Promise<CommentResponseDTO> {
        const comment = await this._commentRepo.create(data);
        return toCommentResponseDTO(comment)
    }





    //   async replyToComment(dto: CreateCommentDto): Promise<IComment> {
    //     return await this._commentRepo.replyToComment(dto);
    //   }

    async getComments(
        parentId: string,
        page: number,
        limit: number,
    ): Promise<IPaginatedResult<CommentResponseDTO>> {
        const result = await this._commentRepo.getCommentsByParentId(parentId, page, limit);
        console.log(result,'result in usecase');
        
        return {
            ...result,
            data: result.data.map(toCommentResponseWithReplyCountDTO)
        }
    }
    
    async getReplies(
        commentId: string,
        page: number,
        limit: number,
    ): Promise<IPaginatedResult<CommentResponseDTO>> {
        const result = await this._commentRepo.getRepliesByCommentId(commentId, page, limit);
        return {
            ...result,
            data: result.data.map(toCommentResponseDTO)
        }

    }
    async updateComment(id: string, dto: UpdateCommentDto): Promise<IComment | null> {
        return await this._commentRepo.update(id, dto);
    }

    async deleteComment(id: string): Promise<boolean> {
        return await this._commentRepo.delete(id);
    }

    async toggleLike(commentId: string, userId: string): Promise<IComment | null> {
        return await this._commentRepo.toggleLike(commentId, userId);
    }
}
