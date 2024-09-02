import mongoose, { Schema, model, Document } from 'mongoose';

interface CommentDocument extends Document {
    userId: mongoose.Types.ObjectId;
    content: string;
    parentId?: string; //opcional para crear comentarios de respuesta
    replies: CommentDocument[];
    reactions: { userId: string; type: string }[];
}

const CommentSchema = new Schema<CommentDocument>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    parentId: { type: String, default: null },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    reactions: [Schema.Types.Mixed]//aqui tuvimos un problema explicado en doc.
});

const CommentModel = model<CommentDocument>('Comment', CommentSchema);

export default CommentModel;
export { CommentDocument };