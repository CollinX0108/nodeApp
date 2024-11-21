import { promises } from "dns";
import { UserDocument, UserInput } from "../models/user.model";
import UserModel from "../models/user.model";
import UserExistError from "../exceptions/UserExistError";
import bcrypt from "bcrypt";
import NotAuthorizedError from "../exceptions/NotAuthorizedError";
import { sign } from "crypto";
import jwt from "jsonwebtoken";


class UserService{

    public async createAdmin(userInput: UserInput): Promise<UserDocument> {
        try {
            const userExist = await this.findByEmail(userInput.email);
            if (userExist) 
                throw new UserExistError("User already exists");
    
            userInput.password = await bcrypt.hash(userInput.password, 10);
            userInput.role = "superadmin"; // Forzamos el rol superadmin
            
            const user = await UserModel.create(userInput);
            return user;
        } catch (error) {
            console.error("Error in userService.createAdmin:", error);
            throw error;
        }
    }
    
    public async create(userInput: UserInput): Promise<UserDocument> {
        try {
            const userExist = await this.findByEmail(userInput.email);
            if (userExist) 
                throw new UserExistError("User already exists");
    
            if (userInput.role === "superadmin") {
                throw new NotAuthorizedError("You cannot set role as superadmin directly");
            }
    
            userInput.password = await bcrypt.hash(userInput.password, 10);
            const user = await UserModel.create(userInput);
            return user;
        } catch (error) {
            console.error("Error in userService.create:", error);
            throw error;
        }
    }
    

    public async  login(userInput: any) {
        try {
            const userExist = await this.findByEmail(userInput.email);
            if(!userExist)
                throw new NotAuthorizedError("Not Authorzed");
                
            const IsMatch:boolean = await bcrypt.compare(userInput.password , userExist.password);
            
             if(!IsMatch)
                throw new NotAuthorizedError("Not Authorzed");

            const token = this.generateToken(userExist);

            return {email:userExist.email , name:userExist.name , token};
              
        } catch (error) {
            throw error; 
        }

    }

    public async findByEmail(email:string): Promise<UserDocument | null> {
        try {
            const user: UserDocument|null = await UserModel.findOne({email});
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async findAll(): Promise<UserDocument[]> {
        try {
            const users = await UserModel.find();
            return users;
        } catch (error) {
            throw error;
        }
    }


    public async findById(id:string): Promise<UserDocument | null> {
        try {
            const user = await UserModel.findById(id);
            return user;
        } catch (error) {
            throw error;
        }
    }


    public async update(id:string , UserInput: UserInput): Promise<UserDocument | null> {
        try {
            const user : UserDocument|null = await UserModel.findByIdAndUpdate(id, UserInput , {returnOriginal: false});
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async delete(id: string): Promise<UserDocument| null> {
        try {
            const user = await UserModel.findByIdAndDelete(id);
            return user;
        } catch (error) {
            throw error;
        }
    }

    private generateToken(user: UserDocument):string {
        try{

            return jwt.sign({user_id: user.id, email: user.email, name: user.name, role: user.role}, process.env.JWT_SECRET || "secret", {expiresIn: "5m"});

        } catch (error){

            throw error;
        }
    }
    
}

export default new UserService();