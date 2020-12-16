import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { Ticket } from '../models/ticket';
import { 
    NotFoundError,
    validateRequest,
    requireAuth,
    NotAuthorizedError
} from '@ernticketing/common';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
    "/api/tickets/:id", 
    requireAuth,
    [
        body("title")
            .notEmpty()
            .withMessage("Must contain title."),
        body("price")
            .isFloat({ gt: 0 })
            .withMessage("Must include positive number as price.")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            throw new NotFoundError();
        }

        if (ticket.userId !== req.user!.id) {
            throw new NotAuthorizedError();
        }

        const { title, price } = req.body;

        ticket.set({
            title,
            price
        });

        await ticket.save();

        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        });

        res.status(200).send(ticket);
    }
);


export { router as updateTicketRouter }