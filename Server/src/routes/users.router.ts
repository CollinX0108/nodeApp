import express, {Request, Response} from 'express';
import userController from '../controllers/user.controller';
import userSchema from '../schemas/user.schema';
import validateSchema from '../middleware/validateSchema';
import auth from '../middleware/auth';

export const router = express.Router();

//router.post("/register", validateSchema(userSchema), userController.create);

router.post("/register", auth, validateSchema(userSchema), userController.create);

router.post("/login", userController.login);

router.get("/", auth, userController.getAll);

router.get("/:profile", auth, userController.getUser);

router.get("/:id/group/:groupId", (req: Request, res: Response) => {
    res.send(`get user with id: ${req.params.id} y groupId: ${req.params.groupId}`);
});

router.get("/:id", userController.getUser);

router.put("/:id", auth, async (req: Request, res: Response) => {
    if (req.body.loggedUser.role !== "superadmin") {
        return res.status(403).json({ message: "Only superadmin can update users" });
    }
    return userController.update(req, res);
});

router.delete("/:id", auth, async (req: Request, res: Response) => {
    if (req.body.loggedUser.role !== "superadmin") {
        return res.status(403).json({ message: "Only superadmin can delete users" });
    }
    return userController.delete(req, res);
});
