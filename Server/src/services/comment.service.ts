import CommentModel, { CommentDocument } from "../models/comment.model";
import mongoose from 'mongoose';

class CommentService {
    public async create(commentInput: any): Promise<CommentDocument> {
        const comment = new CommentModel(commentInput);
        return comment.save();
    }

    public async getAll(): Promise<CommentDocument[]> {
        return CommentModel.find().populate('replies');
    }

    public async getById(id: string): Promise<CommentDocument | null> {
        return CommentModel.findById(id).populate('replies');
    }

    public async update(id: string, updateInput: any): Promise<CommentDocument | null> {
        return CommentModel.findByIdAndUpdate(id, updateInput, { new: true });
    }

    public async delete(id: string): Promise<CommentDocument | null> {
        try {
           
            const comment = await CommentModel.findById(id);
    
            if (!comment) {
                throw new Error('Comment not found');
            }
    
            //lo eliminamos de la lista del padre
            if (comment.parentId) {
                await CommentModel.findByIdAndUpdate(
                    comment.parentId,
                    { $pull: { replies: id } },
                    { new: true }
                );
            }
    
            return CommentModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Error deleting comment');
        }
    }
    
    
    public async addReaction(commentId: string, reaction: { userId: string; type: string }): Promise<CommentDocument | null> {
        return CommentModel.findByIdAndUpdate(
            commentId,
            { $push: { reactions: reaction } },
            { new: true }
        );
    }      

    public async removeReaction(commentId: string, userId: string): Promise<CommentDocument | null> {
        return CommentModel.findByIdAndUpdate(
            commentId,
            { $pull: { reactions: { userId } } },
            { new: true }
        );
    }    
    
    public async addReplyToParent(parentId: string, reply: any) {
        try {
            if (!mongoose.Types.ObjectId.isValid(reply._id)) {
                throw new Error('Invalid reply ID format');
            }
            
            await CommentModel.findByIdAndUpdate(
                parentId,
                { $push: { replies: reply._id } },
                { new: true }
            );
        } catch (error) {
            throw new Error('Error adding reply to parent comment');
        }
    }
    
    
}

export default new CommentService();
