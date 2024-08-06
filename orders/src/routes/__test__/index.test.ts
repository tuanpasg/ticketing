import { Ticket } from "../../models/ticket"
import request from "supertest"
import { app } from "../../app"
import mongoose from "mongoose"

it('check if return all orders created by current user',async()=>{
    const cookie = global.signin();
    // Create a new ticket
    const ticket1 = Ticket.build({
        id:  new mongoose.Types.ObjectId().toString(),
        title:'the eras tour',
        price:100
    })

    await ticket1.save();

    await request(app)
    .post('/api/orders')
    .set('Cookie',cookie)
    .send({ticketId:ticket1._id})
    .expect(201);

    const ticket2 = Ticket.build({
        id: new mongoose.Types.ObjectId().toString(),
        title:'the eras tour',
        price:100
    })

    await ticket2.save();

    await request(app)
    .post('/api/orders')
    .set('Cookie',cookie)
    .send({ticketId:ticket2._id})
    .expect(201);

    const res = await request(app)
    .get('/api/orders')
    .set('Cookie',cookie)
    .send({})
    .expect(200);

    // console.log(res.body);
})