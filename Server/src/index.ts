import "reflect-metadata";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { createSchema } from "./graphql/schema";
import { MyContext } from "./middleware/authChecker";
import dotenv from "dotenv";
import { db } from "./config/db";
import cors from 'cors';

const app = express();

const startServer = async () => {
    dotenv.config();

    const schema = await createSchema();

    const server = new ApolloServer<MyContext>({
        schema,
        introspection: true
    });

    await server.start();

    app.use(express.json());
    app.use(cors());
    
    app.get('/', (req, res) => {
        res.send('GraphQL API is running. Use /graphql endpoint for queries.');
    });

    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => ({
            token: req.headers.authorization
        })
    }));

    // Railway asignará el puerto automáticamente
    const PORT = parseInt(process.env.PORT || '3000', 10);

    await db;
    
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer().catch((error) => {
    console.error('Error starting server:', error);
    process.exit(1);
});

export default app;