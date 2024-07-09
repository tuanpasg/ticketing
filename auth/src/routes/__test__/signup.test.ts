import request from 'supertest'
import { app } from '../../app'

it('returns a 201 on successful signup', async()=>{
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(201);
});

it('return a 400 on invalid email',async()=>{
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'test.com',
        password: 'passoword'
    })
    .expect(400);
})


it('return a 400 on missing email or password',async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com'
    })
    .expect(400);

    await request(app)
    .post('/api/users/signup')
    .send({
        password: 'j3j0fjkl'
    })
    .expect(400);
})


it('disallow duplicate emails', async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(201);

    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(400);
});

it('response with set-cookie', async()=>{
    console.log("NODE_ENV :",process.env.NODE_ENV);
    
    const response = await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});

