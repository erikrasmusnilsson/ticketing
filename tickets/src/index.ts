import 'express-async-errors';
import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const close = () => {
    natsWrapper.client.close();
    process.exit();
}

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("Could not find JWT_KEY");
    }

    if (!process.env.MONGO_URI) {
        throw new Error("Could not find MongoDB URI");
    }

    if (!process.env.NATS_URI) {
        throw new Error("Could not find NATS URI.");
    }

    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error("Could not find NATS cluster id.");
    }

    if (!process.env.NATS_CLIENT_ID) {
        throw new Error("Could not find NATS client id.");
    }

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URI
        );

        natsWrapper.client.on("close", () => {
            console.log("Disconnected to NATS");
            process.exit();
        });

        process.on("SIGINT", () => close());
        process.on("SIGTERM", () => close());

        await mongoose.connect(
            process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            }
        );
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log("v1");
        console.log("tickets service running on port 3000");
    });
}

start();