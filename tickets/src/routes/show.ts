import express, { Request, Response } from 'express';

import { Ticket } from '../models/ticket';
import { NotFoundError } from '@ernticketing/common';

const router = express.Router();

router.get("/api/tickets/:id", async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
        throw new NotFoundError();
    }

    res.send(ticket);
});

router.get("/api/tickets", async (req, res) => {
    const tickets = await Ticket.find({});
    res.status(200).send(tickets);
});

export { router as getTicketsRouter }