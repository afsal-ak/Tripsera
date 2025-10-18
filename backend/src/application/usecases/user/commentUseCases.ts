import { ICommentRepository } from '@domain/repositories/ICommentRepository';
import { CommentResponseDTO, CreateCommentDto, ReplyCommentDto, UpdateCommentDto } from '@application/dtos/CommentDTO';
import { IComment } from '@domain/entities/IComment';
import { ICommentUseCases } from '@application/useCaseInterfaces/user/ICommentUseCases';
import { CommentMapper } from '@application/mappers/commentMapper';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
import { IBlogRepository } from '@domain/repositories/IBlogRepository';
import { AppError } from '@shared/utils/AppError';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';

export class CommentUseCases implements ICommentUseCases {
    constructor(
        private _commentRepo: ICommentRepository,
        private _blogRepo: IBlogRepository
    ) { }

    async createComment(data: CreateCommentDto): Promise<CommentResponseDTO> {
        const blog = await this._blogRepo.findById(data.parentId)
        if (!blog) {
            throw new AppError(HttpStatus.NOT_FOUND, 'Not Found')
        }
        const comment = await this._commentRepo.create(data);
        return CommentMapper.toResponseDTO(comment)
    }
    async replyComment(data: ReplyCommentDto): Promise<CommentResponseDTO> {
        const blog = await this._blogRepo.findById(data.parentId)

        if (!blog) {
            throw new AppError(HttpStatus.NOT_FOUND, 'Not Found')
        }
        const comment = await this._commentRepo.create(data);
        return CommentMapper.toResponseDTO(comment)
    }

    async getComments(
        parentId: string,
        page: number,
        limit: number,
    ): Promise<IPaginatedResult<CommentResponseDTO>> {
        const result = await this._commentRepo.getCommentsByParentId(parentId, page, limit);

        return {
            ...result,
            data: result.data.map(CommentMapper.toResponseWithReplyCountDTO)
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
            data: result.data.map(CommentMapper.toResponseDTO)
        }

    }
    async updateComment(id: string, dto: UpdateCommentDto): Promise<CommentResponseDTO | null> {
        const comment = await this._commentRepo.update(id, dto);
        return comment ? CommentMapper.toResponseDTO(comment) : null

    }

    async deleteComment(id: string): Promise<boolean> {
        return await this._commentRepo.delete(id);
    }

    async toggleLike(commentId: string, userId: string): Promise<CommentResponseDTO | null> {
        const comment = await this._commentRepo.toggleLike(commentId, userId);
        return comment ? CommentMapper.toResponseDTO(comment) : null

    }
}
