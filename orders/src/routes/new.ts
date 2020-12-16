import express, { Request, Response } from 'express';

import { 
    requireAuth,
    validateRequest,
    NotFoundError,
    OrderStatus,
    BadRequestError
} from '@ernticketing/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const router = express.Router();

router.post("/api/orders", requireAuth, [
    body("ticketId")
        .notEmpty()
        .withMessage("Ticket ID must be provided.")
], validateRequest, async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new NotFoundError();
    }

    const reserved = await Order.findOne({ 
        ticket,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ] 
        }
    });

    if (reserved) {
        throw new BadRequestError("Ticket has already been reserved.");
    }

    res.send({});
});

export { router as newOrderRouter };
