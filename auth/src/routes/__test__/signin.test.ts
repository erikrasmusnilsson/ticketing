import request from 'supertest';
import { app } from '../../app';

it("returns 200 on success", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password"
        });
    
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(200);
});

it("returns 400 when email does not exist", async () => {
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(400);
});

it("returns 400 when password in incorrect", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password"
        });
    
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "invalid-password"
        })
        .expect(400);
});

it("returns 400 when missing email and password", async () => {
    await request(app)
        .post("/api/users/signin")
        .send({})
        .expect(400);

    await request(app)
        .post("/api/users/signin")
        .send({
            password: "invalid-password"
        })
        .expect(400);

    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
        })
        .expect(400);
});

it("returns 400 when email is invalid", async () => {
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test.com",
            password: "password"
        })
        .expect(400);
});