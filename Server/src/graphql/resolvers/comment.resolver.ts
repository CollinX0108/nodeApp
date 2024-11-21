import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from "type-graphql";
import { CommentType, ReactionType } from "../types/comment.type";
import CommentService from "../../services/comment.service";
import { MyContext } from "../../middleware/authChecker";
import { COMMENT_FRAGMENTS } from '../fragments/comment.fragments';
import { CommentDocument } from "../../models/comment.model";
import mongoose from 'mongoose';

@Resolver()
export class CommentResolver {
    // Queries
    @Query(() => [CommentType])
    @Authorized()
    async comments() {
        const comments = await CommentService.getAll();
        return comments;
    }

    @Query(() => CommentType, { nullable: true })
    @Authorized()
    async comment(@Arg("id") id: string) {
        const comment = await CommentService.getById(id);
        return comment;
    }

    @Query(() => [CommentType])
    @Authorized()
    async commentReplies(@Arg("parentId") parentId: string) {
        const comment = await CommentService.getById(parentId);
        return comment?.replies || [];
    }

    // Mutations
    @Mutation(() => CommentType)
    @Authorized()
    async createComment(
        @Arg("content") content: string,
        @Arg("parentId", { nullable: true }) parentId: string,
        @Ctx() context: MyContext
    ) {
        const userId = context.user.user_id;
        const comment = await CommentService.create({ 
            content, 
            userId, 
            parentId 
        }) as CommentDocument & { _id: mongoose.Types.ObjectId };

        if (parentId) {
            await CommentService.addReplyToParent(parentId, comment);
        }

        return {
            ...comment.toObject(),
            id: comment._id.toString(),
            reactions: comment.reactions || [],
            replies: comment.replies || []
        };
    }

    @Mutation(() => CommentType)
    @Authorized()
    async updateComment(
        @Arg("id") id: string,
        @Arg("content") content: string,
        @Ctx() context: MyContext
    ) {
        const userId = context.user.user_id;
        const comment = await CommentService.getById(id) as CommentDocument;

        if (!comment || comment.userId.toString() !== userId.toString()) {
            throw new Error("Not authorized to update this comment");
        }

        const updatedComment = await CommentService.update(id, { content }) as CommentDocument & { _id: mongoose.Types.ObjectId };
        return {
            ...updatedComment?.toObject(),
            id: updatedComment?._id.toString(),
            reactions: updatedComment?.reactions || [],
            replies: updatedComment?.replies || []
        };
    }

    @Mutation(() => Boolean)
    @Authorized()
    async deleteComment(
        @Arg("id") id: string,
        @Ctx() context: MyContext
    ) {
        const { user_id: userId, role } = context.user;
        const comment = await CommentService.getById(id) as CommentDocument;

        if (!comment) {
            throw new Error("Comment not found");
        }

        const commentUserId = comment.userId.toString();
        const currentUserId = userId.toString();

        if (commentUserId !== currentUserId && role !== 'superadmin') {
            throw new Error("Not authorized to delete this comment");
        }

        await CommentService.delete(id);
        return true;
    }

    @Mutation(() => CommentType)
    @Authorized()
    async addReaction(
        @Arg("commentId") commentId: string,
        @Arg("reactionType") reactionType: string,
        @Ctx() context: MyContext
    ) {
        const userId = context.user.user_id;
        const updatedComment = await CommentService.addReaction(commentId, {
            userId,
            type: reactionType
        }) as CommentDocument & { _id: mongoose.Types.ObjectId };

        return {
            ...updatedComment?.toObject(),
            id: updatedComment?._id.toString(),
            reactions: updatedComment?.reactions || [],
            replies: updatedComment?.replies || []
        };
    }

    @Mutation(() => CommentType)
    @Authorized()
    async removeReaction(
        @Arg("commentId") commentId: string,
        @Ctx() context: MyContext
    ) {
        const userId = context.user.user_id;
        const updatedComment = await CommentService.removeReaction(commentId, userId) as CommentDocument & { _id: mongoose.Types.ObjectId };
        
        return {
            ...updatedComment?.toObject(),
            id: updatedComment?._id.toString(),
            reactions: updatedComment?.reactions || [],
            replies: updatedComment?.replies || []
        };
    }
}