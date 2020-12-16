import request from 'supertest';
import { app } from '../../app';

import { signup } from '../../test/auth';

it("clears the cookie after signing out", async () => {
    await signup();
    
    const response = await request(app)
        .post("/api/users/signout")
        .send({})
        .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
});