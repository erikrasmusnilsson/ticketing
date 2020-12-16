import { Stan } from 'node-nats-streaming';

import { Subjects } from './subjects';

interface Event {
    subject: Subjects;
    data: any; 
};

export abstract class Publisher<T extends Event> {
    abstract subject: T['subject'];
    
    constructor(private client: Stan) { }

    publish(data: T['data']): Promise<void> {
        return new Promise((resolve, reject) => {
            const json = JSON.stringify(data);

            this.client.publish(this.subject, json, (err) => {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
        });
    }
};