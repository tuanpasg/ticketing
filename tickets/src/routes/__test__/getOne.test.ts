import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../model/tickes';

it('return 404 if requested ticket is not found', async()=>{
    const res = await request(app).get("/api/tickets/660cc9ffbbe8cbcf4d20e1ab").send({}).expect(404);
});

it('return ticket info if found',async()=>{
    const cookie = await global.signin();

    const newTicketResp = await request(app).post('/api/tickets')
    .set("Cookie", cookie)
    .send({
        title:"jr;ljvf",
        price:10
    }).expect(201);
    
    console.log(newTicketResp.body.id);
    
    const getTicketResp = await request(app).get(`/api/tickets/${newTicketResp.body.id}`)
    .send({})
    .expect(200);

    expect(getTicketResp.body.title).toEqual("jr;ljvf");
    expect(getTicketResp.body.price).toEqual(10);
})