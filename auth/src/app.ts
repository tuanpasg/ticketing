
import express from 'express';
import { Request, Response } from 'express';
import { currentUserRouter } from './routes/current-user';
import { signoutRouter } from './routes/logout';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@aaron-sg-org/common';
import cookieSession from 'cookie-session';
require('express-async-errors');

const app = express();
app.set('trust proxy',true);
app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(signoutRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(currentUserRouter);

app.get('/', (req: Request,res: Response)=>{
    res.send("Hello World");
})

app.all("*",async(req,res,next)=>{
    throw new NotFoundError();
})

app.use(errorHandler);

export {app};
