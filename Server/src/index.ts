import express, {Express, Request, Response} from 'express';
import dotenv, { config } from 'dotenv';
import {router} from './routes/users.router';
import routerC from './routes/comments.router';
import {db} from './config/db';

const app: Express = express();
dotenv.config();

const PORT = process.env.PORT || 8000;

app.use(express. json());
app.use(express.urlencoded({extended: true}));

app.use('/api/users', router);
app.use('/api/comments', routerC);

app.get('/', (req: Request, res: Response) => {
    res.send("Hello World");
})

db.then(() =>
app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`)
})

);
