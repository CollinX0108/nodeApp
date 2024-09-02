import { Request, Response } from 'express';
import CommentService from '../services/comment.service';
import mongoose from 'mongoose';

class CommentController {

    public async create(req: Request, res: Response) {
        try {
            //sacamos el usuario logeado
            const loggedUser = req.body.loggedUser;
            
            //vemos si loggedUser y el user_id están presentes porque es necesario
            if (!loggedUser || !loggedUser.user_id) {
                return res.status(400).json({ message: "UserId is required" });
            }
    
            //vemos si el user_id tiene el formato porque esto me estaba dando error
            if (!mongoose.Types.ObjectId.isValid(loggedUser.user_id)) {
                return res.status(400).json({ message: "Invalid userId format" });
            }

            const { ...commentData } = req.body;
    
            const comment = await CommentService.create({ ...commentData, userId: loggedUser.user_id });

            if (comment.parentId) {
                await CommentService.addReplyToParent(comment.parentId, comment);
            }
    
            return res.status(201).json(comment);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error', error });
        }
    }
    
    public async getAll(req: Request, res: Response) {
        try {
            const comments = await CommentService.getAll();
            return res.status(200).json(comments);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error', error });
        }
    }

    public async getById(req: Request, res: Response) {
        try {
            const comment = await CommentService.getById(req.params.id);
            if (!comment) return res.status(404).json({ message: 'Comment not found' });
            return res.status(200).json(comment);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error', error });
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const { userId } = req.body.loggedUser;
            const comment = await CommentService.getById(req.params.id);
            if (!comment) return res.status(404).json({ message: 'Comment not found' });
            if (comment.userId !== userId) return res.status(403).json({ message: 'Not authorized' });

            const updatedComment = await CommentService.update(req.params.id, req.body);
            return res.status(200).json(updatedComment);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error', error });
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { userId, role } = req.body.loggedUser; // Extraer userId y role del loggedUser
            const comment = await CommentService.getById(req.params.id);
    
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
    
            // Verificar si el usuario es el autor del comentario o es un superadmin
            if (comment.userId !== userId && role !== 'superadmin') {
                return res.status(403).json({ message: 'Not authorized' });
            }
    
            await CommentService.delete(req.params.id);
            return res.status(200).json({ message: 'Comment deleted' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error', error });
        }
    }
    
    

    public async addReaction(req: Request, res: Response) {
        try {
            const loggedUser = req.body.loggedUser;
            const userId = loggedUser.user_id;
            const idComment = req.params.id;
            const { reactionType } = req.body; 

            //esto es para verificar porque estaba mandando cosas que no eran
            console.log('Logged User:', loggedUser);
            console.log('User ID:', userId);
            console.log('Comment ID:', idComment);
            console.log('Reaction Type:', reactionType);
    
            if (!reactionType) {
                return res.status(400).json({ message: 'Reaction type is required' });
            }
    
            const reaction = { userId, type: reactionType };
    
            console.log('Reaction Object:', reaction);

            const updatedComment = await CommentService.addReaction(idComment, reaction);
    
            return res.status(200).json(updatedComment);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error', error });
        }
    }      
    

    public async removeReaction(req: Request, res: Response) {
        try {
            const { user_id } = req.body.loggedUser;  
            const commentId = req.params.id;       
            const updatedComment = await CommentService.removeReaction(commentId, user_id);
            return res.status(200).json(updatedComment);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error', error });
        }
    }
    
}

export default new CommentController();
