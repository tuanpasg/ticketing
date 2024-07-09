import express, { NextFunction, Request, Response } from "express"
import { Ticket } from "../model/tickes";
import { NotFoundError } from "@aaron-sg-org/common";

const router = express.Router();

router.get('/api/tickets/:ticketId',async(req:Request, res:Response, next:NextFunction)=>{
    // console.log(req.params.ticketId);

    const ticket = await Ticket.findById(req.params.ticketId);

    if(ticket){
        return res.status(200).send(ticket);
    }

    console.log("Calling Not Found Error");
    return next(new NotFoundError());

})

export {router as getTicketRoute};