import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/user.model";

dotenv.config();

const createFirstAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "");
        
        const password = await bcrypt.hash("admin123", 10);
        
        const adminUser = await User.create({
            name: "Super Admin",
            email: "superadmin@admin.com",
            password: password,
            role: "superadmin"
        });

        console.log("✅ Primer superadmin creado exitosamente:", adminUser);
    } catch (error) {
        console.error("❌ Error creando superadmin:", error);
    } finally {
        await mongoose.disconnect();
    }
};

createFirstAdmin();