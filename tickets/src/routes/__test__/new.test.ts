import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../model/tickes';

it('has a route handler listening to /api/tickets for post request', async()=>{
    // return request(app)
    // .post('/api/users/signup')
    // .send({
    //     email: 'test@test.com',
    //     password: 'password'
    // })
    // .expect(201);
    const res = await request(app).post("/api/tickets").send({});
    expect(res.status).not.toEqual(404);
});

it('can only be accessed only if the user is signed in', async()=>{
    const cookie = await global.signin();

    const res = await request(app).post('/api/tickets')
    .set("Cookie", cookie)
    .send({});

    expect(res.status).not.toEqual(401);
});

it('returns an error if an invalid title is submitted', async()=>{
    const cookie = await global.signin();

    await request(app).post('/api/tickets')
    .set("Cookie", cookie)
    .send({
        title:"",
        price:10
    }).expect(400)

    await request(app).post('/api/tickets')
    .set("Cookie", cookie)
    .send({
        price:10
    }).expect(400)
});

it('returns an error if an invalid price is submitted', async()=>{
    const cookie = await global.signin();

    await request(app).post('/api/tickets')
    .set("Cookie", cookie)
    .send({
        title:"jr;ljvf",
        price:-1
    }).expect(400)
    
    await request(app).post('/api/tickets')
    .set("Cookie", cookie)
    .send({
        title:"jr;ljvf"
    }).expect(400)
});

it('creat a ticket when valid inputs are provided', async()=>{
    const cookie = await global.signin();
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const res = await request(app).post('/api/tickets')
    .set("Cookie", cookie)
    .send({
        title:"jr;ljvf",
        price:10
    }).expect(201)

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual("jr;ljvf");
    expect(tickets[0].price).toEqual(10);
});
// it('can only be accessed only if the user is signed in', async()=>{});
// it('can only be accessed only if the user is signed in', async()=>{});