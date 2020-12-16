import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

import { signup } from '../../test/auth';

jest.mock("../../nats-wrapper");

const createTicket = () => {
    return request(app)
        .post("/api/tickets")
        .set("Cookie", signup())
        .send({
            title: "Abc123",
            price: 32
        });
};

it("returns a 404 if ticket is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);
});

it("returns ticket if it exists", async () => {
    const title = "Title";
    const price = 123;
    
    const postResponse = await request(app)
        .post("/api/tickets")
        .set("Cookie", signup())
        .send({
            title,
            price
        })
        .expect(201);

    const getResponse = await request(app)
        .get(`/api/tickets/${postResponse.body.id}`)
        .send()
        .expect(200);

    expect(getResponse.body.title).toEqual(title);
    expect(getResponse.body.price).toEqual(price);
});

it("returns a list of tickets", async () => {
    await createTicket();
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app)
        .get("/api/tickets")
        .send()
        .expect(200);

    expect(response.body.length).toEqual(4);
});