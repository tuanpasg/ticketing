
import express from 'express';
import { Request, Response } from 'express';
import { errorHandler, NotFoundError, currentUser} from '@aaron-sg-org/common';
import cookieSession from 'cookie-session';
import { newTicketRoute } from './routes/new';
import { updateTicketRoute } from './routes/update';
import { getAllTicketsRoute } from './routes/getAll';
import { getTicketRoute } from './routes/getOne';

require('express-async-errors');

const app = express();

app.set('trust proxy',true);

app.use(express.json());
app.use(cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV !== 'test'
    secure: false
}));

app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});

app.use(currentUser);
app.use(newTicketRoute);
app.use(updateTicketRoute);
app.use(getAllTicketsRoute);
app.use(getTicketRoute);


app.all("*",async(req,res,next)=>{
    throw new NotFoundError();
})

app.use(errorHandler);

export {app};
