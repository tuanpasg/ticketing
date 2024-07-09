import { app } from "../../app"
import request from 'supertest'


it('wrong email or password',async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email: "test@test.com",
        password: "password"
    }).expect(201)

    await request(app)
    .post('/api/users/signin')
    .send({
        email: "test_0@test.com",
        password: "password"
    }).expect(400)

    await request(app)
    .post('/api/users/signin')
    .send({
        email: "test@test.com",
        password: "password_0"
    }).expect(400)

    // expect(response.get('Set-Cookie')).toBeDefined();
})

it('response with set-cookie on successful signin',async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email: "test@test.com",
        password: "password"
    }).expect(201)

    const response =await request(app)
    .post('/api/users/signin')
    .send({
        email: "test@test.com",
        password: "password"
    }).expect(200)

    expect(response.get('Set-Cookie')).toBeDefined();
})