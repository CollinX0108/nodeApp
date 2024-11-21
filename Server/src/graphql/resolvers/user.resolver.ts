import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from "type-graphql";
import { UserType, UserResponse, UpdateUserInput } from "../types/user.type";
import userService from "../../services/user.service";
import { MyContext } from "../../middleware/authChecker";
import { UserInput } from "../../models/user.model";

@Resolver()
export class UserResolver {
    // Queries
    @Query(() => [UserType])
    @Authorized()
    async users() {
        return await userService.findAll();
    }

    @Query(() => UserType, { nullable: true })
    @Authorized()
    async user(@Arg("id") id: string) {
        return await userService.findById(id);
    }

    // Mutations
    @Mutation(() => UserResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {
        return await userService.login({ email, password });
    }

    @Mutation(() => UserType)
    async register(
        @Arg("name") name: string,
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {
        const userInput: UserInput = {
            name,
            email,
            password,
            role: "regular"
        };
        return await userService.create(userInput);
    }

    @Mutation(() => UserType)
    @Authorized()
    async updateUser(
        @Arg("id") id: string,
        @Arg("input") input: UpdateUserInput,
        @Ctx() context: MyContext
    ) {
        const { role } = context.user;
        if (role !== "superadmin") {
            throw new Error("Only superadmin can update users");
        }

        const updateData: Partial<UserInput> = {};
        if (input.name) updateData.name = input.name;
        if (input.email) updateData.email = input.email;
        
        return await userService.update(id, updateData as UserInput);
    }

    @Mutation(() => Boolean)
    @Authorized()
    async deleteUser(
        @Arg("id") id: string,
        @Ctx() context: MyContext
    ) {
        const { role } = context.user;
        if (role !== "superadmin") {
            throw new Error("Only superadmin can delete users");
        }
        await userService.delete(id);
        return true;
    }

    @Mutation(() => UserType)
    @Authorized()
    async createAdmin(
        @Arg("name") name: string,
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() context: MyContext
    ) {
        const { role } = context.user;
        if (role !== "superadmin") {
            throw new Error("Only superadmin can create admin users");
        }

        const userInput: UserInput = {
            name,
            email,
            password
        };
        
        return await userService.createAdmin(userInput);
    }
}