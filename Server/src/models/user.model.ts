import mongoose, { DateSchemaDefinition } from "mongoose";


export interface UserInput {
    name: string;
    email: string;
    password: string;
    role?: string; //lo dejamos opcional
}

export interface UserDocument extends UserInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    deleteAt: Date;
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["superadmin", "regular"], default: "regular" }
}, { timestamps: true, collection: "users" });

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;