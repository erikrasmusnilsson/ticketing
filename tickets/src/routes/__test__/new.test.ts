import request from 'supertest';
import { app } from '../../app';

import { signup } from '../../test/auth';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

jest.mock("../../nats-wrapper");
 
it("has a route handler listening to /api/tickets for post requests", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .send({});
        
    expect(response.status).not.toEqual(404);
});

it("can only be accessed if user is signed in", async () => {
    await request(app)
        .post("/api/tickets")
        .send({})
        .expect(401);
});

it("can be accessed if user is signed in", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", signup())
        .send({});
    expect(response.status).not.toEqual(401);
});

it("returns an error if title is invalid", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", signup())
        .send({
            title: "",
            price: 32
        })
        .expect(400);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", signup())
        .send({
            price: 32
        })
        .expect(400);
});

it("returns an error if price is invalid", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", signup())
        .send({
            title: "Title",
            price: -32
        })
        .expect(400);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", signup())
        .send({
            title: "Title",
        })
        .expect(400);
});

it("creates ticket if everything is valid", async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", signup())
        .send({
            title: "Title",
            price: 20
        })
        .expect(201);

    tickets = await Ticket.find({});

    expect(tickets.length).toEqual(1);
});

it("publishes an event", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", signup())
        .send({
            title: "Title",
            price: 20
        })
        .expect(201);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});