import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "Not authorized" });
        }

        token = token.replace("Bearer ", "");
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");

        req.body.loggedUser = decoded;
        //req.params.id = decoded.user_id;

        //if (req.method === 'POST' && req.path === '/api/comments/create') {
        //    req.body.userId = decoded.user_id;
        //}

        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            res.status(401).json({ message: "Token expired", error });
        } else {
            res.status(401).json({ message: "Invalid token", error });
        }
    }
}

export default auth;
