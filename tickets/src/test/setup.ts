import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

let mongo: MongoMemoryServer;

beforeAll(async () => {
    process.env.JWT_KEY = "asdasd";

    mongo = new MongoMemoryServer();
    const uri = await mongo.getUri();
    
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }

    jest.clearAllMocks();
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});