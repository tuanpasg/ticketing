import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

const start = async()=>{
    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY must be defined');
    }

    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI must be defined');
    }

    try{
        await natsWrapper.connect('ticketing','client0','http://nats-srv:4222');
        natsWrapper.client.on('close',()=>{
            console.log('NATS connection closed!');
            process.exit()
        })

        process.on("SIGINT",()=>natsWrapper.client.close());
        process.on("SIGTERM",()=>natsWrapper.client.close())

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB!!!');
    }catch(err){
        console.log(err);
    }

    app.listen(3000,()=>{
        console.log(`Auth service running on port 3000!!!`);
    })
}

start();