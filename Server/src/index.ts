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
    
    // Ruta de prueba básica
    app.get('/', (req, res) => {
        res.send('GraphQL API is running. Use /graphql endpoint for queries.');
    });

    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => ({
            token: req.headers.authorization
        })
    }));

    const PORT = process.env.PORT || 8000;

    await db;
    
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}/graphql`);
    });
};

startServer().catch((error) => {
    console.error('Error starting server:', error);
    process.exit(1);
});

export default app;