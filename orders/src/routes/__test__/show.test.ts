import { Ticket } from "../../models/ticket"
import request from "supertest"
import { app } from "../../app"
import mongoose from "mongoose";

it('check if return all orders created by current user',async()=>{
    const cookie = global.signin();
    // Create a new ticket
    const ticket1 = Ticket.build({
        title:'the eras tour',
        price:100
    })

    await ticket1.save();

    let res = await request(app)
    .post('/api/orders')
    .set('Cookie',cookie)
    .send({ticketId:ticket1._id})
    .expect(201);

    const orderId_1 = res.body.id;

    const ticket2 = Ticket.build({
        title:'the eras tour',
        price:100
    })

    await ticket2.save();

    res = await request(app)
    .post('/api/orders')
    .set('Cookie',cookie)
    .send({ticketId:ticket2._id})
    .expect(201);

    const orderId_2 = res.body.id;

    res = await request(app)
    .get(`/api/orders/${orderId_1}`)
    .set('Cookie',cookie)
    .send({})
    .expect(200)

    expect(res.body.id).toEqual(orderId_1);
})

it('Check if return 404 error in case the request order does not exist',async()=>{
    const cookie = global.signin();
    // Create a new ticket
    const ticket1 = Ticket.build({
        title:'the eras tour',
        price:100
    })

    await ticket1.save();

    let res = await request(app)
    .post('/api/orders')
    .set('Cookie',cookie)
    .send({ticketId:ticket1._id})
    .expect(201);

    res = await request(app)
    .get(`/api/orders/${new mongoose.Types.ObjectId()}`)
    .set('Cookie',cookie)
    .send({})
    .expect(404)
})