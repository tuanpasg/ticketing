import express, { NextFunction, Request, Response } from "express";
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@aaron-sg-org/common";
import { body } from "express-validator";
import { Ticket } from "../model/tickes";
import { isNamedExportBindings } from "typescript";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";
const router = express.Router();

router.put("/api/tickets/:ticketId",
requireAuth,
[
    body('title').notEmpty().withMessage("Ticket name must not be empty"),
    body('price').notEmpty().withMessage("Price can not be empty"),
    body('price').isFloat({gt:0}).withMessage("Price must be a positive number")
],
validateRequest,
async(req: Request, res: Response, next:NextFunction)=>{
    const {title,price} = req.body;
    
    const ticket = await Ticket.findById(req.params.ticketId);
    
    if(!ticket){
        return next(new NotFoundError);//404
    }

    if(ticket.orderId){
        return next(new BadRequestError("Can not update a reserved ticket"));
    }

    if (ticket.userId===req.currentUser!.id){
        ticket.title = title;
        ticket.price = price;
        await ticket.save();
        await new TicketUpdatedPublisher(natsWrapper.client).publish({
            id:ticket.id,
            title:ticket.title,
            price:ticket.price,
            userId:ticket.userId,
            version:ticket.version
        })
        return res.status(200).send(ticket);
    }else{
        return next(new NotAuthorizedError());//401
    }

});

export {router as updateTicketRoute};
