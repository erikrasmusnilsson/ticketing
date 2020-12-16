import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const id = randomBytes(4).toString("hex");

const client = nats.connect("ticketing", id, {
    url: "http://localhost:4222"
});

client.on("connect", () => {
    console.log("listener connected");

    client.on("close", () => {
        console.log("closing connection");
        process.exit();
    });

    new TicketCreatedListener(client).listen();
});

const exit = () => {
    client.close();
    process.exit();
};

process.on("SIGINT", exit);
process.on("SIGTERM", exit);




