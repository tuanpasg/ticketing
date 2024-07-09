import { OrderStatus } from "@aaron-sg-org/common";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import request from "supertest";

it('check if return successful when successfully deleted',async()=>{
    // Create a new ticket
    const cookie = global.signin();
    const ticket = Ticket.build({
        title:'the eras tour',
        price:100
    })

    await ticket.save();

    let res = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ticketId:ticket._id})
    .expect(201);

    const orderId = res.body.id;
    console.log(orderId);
    res = await request(app)
    .delete(`/api/orders/${orderId}`)
    .set('Cookie', cookie)
    .expect(200);

    expect(res.body.status).toEqual(OrderStatus.Cancelled);
})