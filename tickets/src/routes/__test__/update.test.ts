import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

import { signup } from '../../test/auth';
import { natsWrapper } from '../../nats-wrapper';

jest.mock("../../nats-wrapper");

it("returns 404 if ticket does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", signup())
        .send({
            title: "new title",
            price: 34
        })
        .expect(404);
});

it("returns 401 if user is not authenticated", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", signup())
        .send({
            title: "Title",
            price: 20
        });
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .send({
            title: "newer title",
            price: 10
        })
        .expect(401);
});

it("returns 404 if the user does not own the ticket", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", signup())
        .send({
            title: "Title",
            price: 20
        });
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", signup())
        .send({
            title: "newer title",
            price: 10
        })
        .expect(401);
});

it("returns 400 if user provides invalid title or price", async () => {
    const cookie = signup();
    
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "Title",
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "",
            price: 20
        })
        .expect(400);
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "Title",
            price: -20
        })
        .expect(400);
});

it("updates the ticket with valid inputs", async () => {
    const cookie = signup();

    const postResponse = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "Title",
            price: 20
        });

    const title = "newer title";
    const price = 77;

    await request(app)
        .put(`/api/tickets/${postResponse.body.id}`)
        .set("Cookie", cookie)
        .send({
            title, 
            price
        })
        .expect(200);
    
    const getResponse = await request(app)
        .get(`/api/tickets/${postResponse.body.id}`)
        .send();

    expect(getResponse.body.title).toEqual(title);
    expect(getResponse.body.price).toEqual(price);
});

it("publishes an event", async () => {
    const cookie = signup();

    const postResponse = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "Title",
            price: 20
        });

    const title = "newer title";
    const price = 77;

    await request(app)
        .put(`/api/tickets/${postResponse.body.id}`)
        .set("Cookie", cookie)
        .send({
            title, 
            price
        })
        .expect(200);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});