import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@aaron-sg-org/common";
import { body } from "express-validator";
import { Ticket } from "../model/tickes";
import { TicketCreatedListener } from "../events/publishers/ticket-created-listener";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";
const router = express.Router();

router.post("/api/tickets",
requireAuth,
[
    body('title').notEmpty().withMessage("Ticket name must not be empty"),
    body('price').notEmpty().withMessage("Price can not be empty"),
    body('price').isFloat({gt:0}).withMessage("Price must be a positive number")
],
validateRequest,
async(req: Request, res: Response)=>{
    const {title,price} = req.body;
    const userId = req.currentUser?.id;

    const newTicket = Ticket.build({title,price,userId:userId!});
    
    await newTicket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id:newTicket.id,
        title:newTicket.title,
        price:newTicket.price,
        userId:newTicket.userId,
        version:newTicket.version
    })
    
    return res.status(201).send(newTicket);
});

export {router as newTicketRoute};
