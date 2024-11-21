import { Field, ObjectType, ID, InputType } from "type-graphql";

@ObjectType()
export class UserType {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    role: string;

    @Field(() => Date, { nullable: true })
    createdAt?: Date;

    @Field(() => Date, { nullable: true })
    updatedAt?: Date;
}

@ObjectType()
export class UserResponse {
    @Field()
    email: string;

    @Field()
    name: string;

    @Field()
    token: string;
}

@InputType()
export class UpdateUserInput {
    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => String, { nullable: true })
    email?: string;
}