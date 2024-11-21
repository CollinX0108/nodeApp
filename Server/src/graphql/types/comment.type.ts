import { Field, ObjectType, ID } from "type-graphql";
import { UserType } from "./user.type";

@ObjectType()
export class ReactionType {
    @Field(() => String)
    userId!: string;

    @Field(() => String)
    type!: string;
}

@ObjectType()
export class CommentType {
    @Field(() => ID)
    id!: string;

    @Field(() => String)
    userId!: string;

    @Field(() => String)
    content!: string;

    @Field(() => String, { nullable: true })
    parentId?: string;

    @Field(() => [CommentType], { nullable: true })
    replies?: CommentType[];

    @Field(() => [ReactionType], { nullable: true })
    reactions?: ReactionType[];

    @Field(() => Date, { nullable: true })
    createdAt?: Date;

    @Field(() => Date, { nullable: true })
    updatedAt?: Date;
}

@ObjectType()
class CommentResponse {
    @Field(() => String)
    message!: string;

    @Field(() => CommentType, { nullable: true })
    comment?: CommentType;
}