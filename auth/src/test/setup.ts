import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import {app} from "../app"
import request from 'supertest'

declare global {
    var signin: () => Promise<string[]>;
}

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

global.signin = async()=>{
    const response =  await request(app)
    .post('/api/users/signup')
    .send({
        email: "test@test.com",
        password: "password"
    }).expect(201);

    const cookie = response.get('Set-Cookie');
    if (!cookie) {
        throw new Error("Set-Cookie header not found");
    }
    return cookie;
}