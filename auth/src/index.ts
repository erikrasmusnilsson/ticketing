import 'express-async-errors';
import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("Could not find JWT_KEY");
    }

    try {
        await mongoose.connect(
            "mongodb://auth-mongo-srv:27017/auth", {
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
        console.log("auth service running on port 3000");
    });
}

start();