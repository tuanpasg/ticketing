import request from 'supertest'
import { app } from '../../app'

it("get current user info",async()=>{
    // const response =  await request(app)
    // .post('/api/users/signup')
    // .send({
    //     email: "test@test.com",
    //     password: "password"
    // }).expect(201);

    // const cookie = response.get('Set-Cookie');

    const cookie = await global.signin();

    const response1 = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie',cookie)
    .send()
    .expect(400);

    expect(response1.body.currentUser.email).toEqual('test@test.com');
})

it("response with error on unauthorized request ",async()=>{
    const response1 = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(401);
})