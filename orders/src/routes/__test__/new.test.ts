import request from "supertest";
import mongoose from "mongoose"
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from '@aaron-sg-org/common';
import { natsWrapper } from "../../nats-wrapper";

it('check if return error when no ticket found',async()=>{
    const ticketId = new mongoose.Types.ObjectId();
    const res = await request(app)
    .post('/api/orders')
    .set('Cookie',global.signin())
    .send({ticketId:ticketId})
    .expect(404);
})

it('check if return error when ticket is reserved',async()=>{
    // Create a new ticket
    const ticket = Ticket.build({
        title:'the eras tour',
        price:100
    })

    await ticket.save();

    // Create an order for this ticket
    const expiration = new Date();
    const order = Order.build({
        userId: "userId",
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: ticket
    })

    await order.save();

    const res = await request(app)
    .post('/api/orders')
    .set('Cookie',global.signin())
    .send({ticketId:ticket._id})
    .expect(400);
    // console.log(res.body);
})

it('check if return order when successfully created',async()=>{
    // Create a new ticket
    const ticket = Ticket.build({
        title:'the eras tour',
        price:100
    })

    await ticket.save();

    const res = await request(app)
    .post('/api/orders')
    .set('Cookie',global.signin())
    .send({ticketId:ticket._id})
    .expect(201);
    // console.log(res.body);
})

it("check if emit order created event",async()=>{
    const ticket = Ticket.build({
        title:'the eras tour',
        price:100
    })

    await ticket.save();

    const res = await request(app)
    .post('/api/orders')
    .set('Cookie',global.signin())
    .send({ticketId:ticket._id})
    .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})