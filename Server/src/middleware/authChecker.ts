import { AuthChecker } from "type-graphql";
import jwt from "jsonwebtoken";

export interface MyContext {
  token?: string;
  user?: any;
}

export const authChecker: AuthChecker<MyContext> = async ({ context }) => {
  try {
    const token = context.token?.replace("Bearer ", "");

    if (!token) {
      return false;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    context.user = decoded;
    
    return true;
  } catch (error) {
    return false;
  }
};