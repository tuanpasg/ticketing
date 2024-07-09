import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import {app} from "../app"
import request from 'supertest'
import jwt from 'jsonwebtoken'

declare global {
    var signin: () => Promise<string[]>;
}

jest.mock('../nats-wrapper');

let mongo: any;

beforeAll(async () => {  
    process.env.JWT_KEY = '32nl4jr';
    // console.log('Starting MongoDB setup...');
    mongo = await MongoMemoryServer.create();
    // console.log('MongoDB setup complete.');
    const mongoUri = mongo.getUri();
    // console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    // console.log('MongoDB connection established.');
});


beforeEach(async()=>{
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections){
        await collection.deleteMany({});
    };
})

afterAll(async()=>{
    if(mongo){
        await mongo.stop();
    }
    
    await mongoose.connection.close();
})

global.signin=async()=>{
    // const response =  await request(app)
    // .post('/api/users/signup')
    // .send({
    //     email: "test@test.com",
    //     password: "password"
    // }).expect(201);

    // const cookie = response.get('Set-Cookie');
    const token = jwt.sign({
        id: new mongoose.Types.ObjectId().toHexString(),
        email: "test@test.com"
    },process.env.JWT_KEY!);

    const session = {jwt:token};

    const sessionJSON = JSON.stringify(session);

    const base64 = Buffer.from(sessionJSON).toString('base64');

    return [`session=${base64}`];
}