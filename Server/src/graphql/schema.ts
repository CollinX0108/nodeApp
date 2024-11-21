import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user.resolver";
import { CommentResolver } from "./resolvers/comment.resolver";
import { authChecker } from "../middleware/authChecker";
import { COMMENT_FRAGMENTS } from './fragments/comment.fragments';

export const createSchema = async () => {
    const schema = await buildSchema({
        resolvers: [UserResolver, CommentResolver],
        authChecker,
        validate: false
    });

    return schema;
};