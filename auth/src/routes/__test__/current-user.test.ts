import request from 'supertest';
import { app } from '../../app';

import { signup } from '../../test/auth';

it("returns user details", async () => {
    const cookie = await signup();

    const response = await request(app)
        .get("/api/users/current")
        .set("Cookie", cookie)
        .send({})
        .expect(200);

    expect(response.body.currentUser.email).toEqual("test@test.com");

});

it("returns null if not authenticated", async () => {
    const response = await request(app)
        .get("/api/users/current")
        .send({})
        .expect(200);
    
    expect(response.body.currentUser).toBeNull();
});