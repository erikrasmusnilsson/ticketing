import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const id = randomBytes(4).toString("hex");

const client = nats.connect("ticketing", id, {
    url: "http://localhost:4222"
});

client.on("connect", async () => {
    console.log("Publisher connected.");

    const publisher = new TicketCreatedPublisher(client);

    await publisher.publish({
        id: "some_id",
        title: "Eyy",
        price: 12
    });
});