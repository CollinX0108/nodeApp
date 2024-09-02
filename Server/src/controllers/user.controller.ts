import { Request, Response } from "express";
import { UserDocument, UserInput } from "../models/user.model";
import userService from "../services/user.service";
import { error } from "console";
import UserExistError from "../exceptions/UserExistError";
import NotAuthorizedError from "../exceptions/NotAuthorizedError";

class UserController {

    public async create(req: Request, res: Response) {
        try {
            const loggedUser = req.body.loggedUser;
            
            console.log("Logged user:", loggedUser);

            if (!loggedUser) {
                return res.status(401).json({ message: "No logged user found" });
            }
    
            if (loggedUser.role !== "superadmin") {
                return res.status(403).json({ message: "Only superadmin can create users" });
            }
    
            const user: UserDocument = await userService.create(req.body as UserInput);
            return res.status(201).json(user);
        } catch (error) {
            console.error("Error creating user:", error);
            if (error instanceof UserExistError) {
                return res.status(400).json({ message: "User already exists" });
            }
            return res.status(500).json({ message: "Internal Server Error", error });
        }
    }
    

    public async login (req: Request, res: Response){
        //status(201).send("create user with email: "+ req.body.email);
        try {
            const userObj = await userService.login(req.body);
            return res.status(201).json(userObj);            
        } catch (error) {
            if (error instanceof NotAuthorizedError){
                res.status(400).json({message: "Not authorized"});
                return;
            }   
            res.status(500).json(error)
        }

    }

    public async update(req: Request, res: Response) {
        try {
            const loggedUser = req.body.loggedUser; // El usuario autenticado
            
            if (loggedUser.role !== 'superadmin') {
                return res.status(403).json({ message: 'Only superadmin can update users' });
            }
            
            const userId = req.params.id; // El ID del usuario a actualizar desde la URL
            const updatedUser = await userService.update(userId, req.body as UserInput);
    
            if (!updatedUser) {
                return res.status(404).json({ error: 'not found', message: `User ${userId} not found` });
            }
    
            return res.status(200).json(updatedUser);
        } catch (error) {
            if (!res.headersSent) {
                return res.status(500).json({ message: 'Internal Server Error', error });
            }
        }
    }
    

    public async getUser (req: Request, res: Response){
        try {
             const user: UserDocument | null = await userService.findById(req.params.id);
            if (!user) 
                res.status(404).json({error:"not found",message:`user ${req.params.id} not found}`});
            res.json(user);
        } catch (error) {
            res.status(500).json(error) 
        }
        //res.send(`get user with id: ${req.params.id}`);
    }

    public async getAll(req: Request, res: Response) {
        try {
            const loggedUser = req.body.loggedUser;
    
            //solo los usuarios que esten logeados pueden ver la lista
            if (!loggedUser) {
                return res.status(401).json({ message: "Not authorized" });
            }
    
            const users: UserDocument[] = await userService.findAll();
    
            return res.status(200).json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            return res.status(500).json({ message: "Internal Server Error", error });
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const loggedUser = req.body.loggedUser;
            
            if (loggedUser.role !== 'superadmin') {
                return res.status(403).json({ message: 'Only superadmin can delete users' });
            }
            
            const userId = req.params.id;
            const deletedUser = await userService.delete(userId);
            
            if (!deletedUser) {
                return res.status(404).json({ error: 'not found', message: `User ${userId} not found` });
            }
            
            return res.status(200).json({ message: `User ${userId} deleted successfully` });
        } catch (error) {
            if (!res.headersSent) {
                return res.status(500).json({ message: 'Internal Server Error', error });
            }
        }
    }
    
    

}

export default new UserController();