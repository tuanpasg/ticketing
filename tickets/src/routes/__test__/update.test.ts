import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../model/tickes";

it("return a 404 if the provided id does not exist ",async()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    const cookie = await global.signin();
    await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie",cookie)
    .send({
        title:"redrwec",
        price:20
    }).expect(404);
});

it("return a 401 if the user is not authenticated",async()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${id}`)
    .send({
       title:"redrwec",
       price:20
    }).expect(401);
});

it("return a 401 if the user does not own the ticket",async()=>{
//Sign in and create a ticket
const cookie1 = await global.signin();
const newTicketResp = await request(app)
.post('/api/tickets')
.set("Cookie",cookie1)
.send({
    title:"lerjljcv",
    price:20
}).expect(201)

//Sign another account then try to update the ticket
const cookie2 = await global.signin();
await request(app)
.put(`/api/tickets/${newTicketResp.body.id}`)
.set("Cookie",cookie2)
.send({
    title:"jrlkdjv",
    price:10
}).expect(401)
});

it("return a 400 if the user provides an invalid title or price",async()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    const cookie = await global.signin();
    await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie",cookie)
    .send({
        title:"redrwec",
        price:-20
    }).expect(400);

    await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie",cookie)
    .send({
        title:"",
        price:20
    }).expect(400);
});

it("return a 200 if the user provides an invalid title or price",async()=>{
    //Sign in and create a ticket
    const cookie = await global.signin();

    const newTicketResp = await request(app)
    .post('/api/tickets')
    .set("Cookie",cookie)
    .send({
        title:"lerjljcv",
        price:20
    }).expect(201)

    //Update ticket with valid data
    await request(app)
    .put(`/api/tickets/${newTicketResp.body.id}`)
    .set("Cookie",cookie)
    .send({
        title:"jrlkdjv",
        price:10
    }).expect(200)

    // Get the ticket to verify updated data

    const updatedTicketResp = await request(app)
    .get(`/api/tickets/${newTicketResp.body.id}`)
    .set("Cookie",cookie)
    .send({})
    .expect(200);

    expect(updatedTicketResp.body.title).toEqual("jrlkdjv");
    expect(updatedTicketResp.body.price).toEqual(10);
});


it("Checking reserved ticket logic",async()=>{
    //Sign in and create a ticket
    const cookie = await global.signin();

    const newTicketResp = await request(app)
    .post('/api/tickets')
    .set("Cookie",cookie)
    .send({
        title:"lerjljcv",
        price:20
    }).expect(201)

    // Set orderId to simulate the case the ticket is ordered
    const ticket = await Ticket.findById(newTicketResp.body.id);
    ticket!.orderId = new mongoose.Types.ObjectId().toHexString();
    await ticket!.save();

    //Update ticket with valid data
    await request(app)
    .put(`/api/tickets/${newTicketResp.body.id}`)
    .set("Cookie",cookie)
    .send({
        title:"jrlkdjv",
        price:10
    }).expect(400)

    // Get the ticket to verify updated data

    // const updatedTicketResp = await request(app)
    // .get(`/api/tickets/${newTicketResp.body.id}`)
    // .set("Cookie",cookie)
    // .send({})
    // .expect(200);

    // expect(updatedTicketResp.body.title).toEqual("jrlkdjv");
    // expect(updatedTicketResp.body.price).toEqual(10);
});