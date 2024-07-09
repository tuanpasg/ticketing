import express, { Request, Response } from "express"
import { Ticket } from "../model/tickes";
const router = express.Router();
router.get('/api/tickets/',async(req:Request, res:Response)=>{
    const allTickets = await Ticket.find({orderId:undefined});
    return res.status(200).send(allTickets);
})

export {router as getAllTicketsRoute};