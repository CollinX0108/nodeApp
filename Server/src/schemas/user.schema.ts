import {Schema, object, string, z} from "zod";

const UserRoles = ["superadmin", "regular"] as const;
type UserRole = typeof UserRoles[number];

const userSchema = z.object({
    name: z.string().nonempty({ message: "Name is required" }),
    email: z.string().email({ message: "Not a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    role: z.enum(UserRoles).optional()
});

export default userSchema;
