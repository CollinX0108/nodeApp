import express from 'express';
import CommentController from '../controllers/comment.controller';
import auth from '../middleware/auth';

const routerC = express.Router();

routerC.post('/create', auth, CommentController.create);
routerC.get('/', auth, CommentController.getAll);
routerC.get('/:id', auth, CommentController.getById);
routerC.put('/:id', auth, CommentController.update);
routerC.delete('/:id', auth, CommentController.delete);
routerC.post('/:id/react', auth, CommentController.addReaction);
routerC.delete('/:id/Dreaction', auth, CommentController.removeReaction);

export default routerC;
