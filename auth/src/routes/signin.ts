import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError, validateRequest } from '@ernticketing/common';
import { User } from '../models/user';
import { Password } from '../utils/password';

const router = express.Router();

router.post("/api/users/signin", [
    body("email")
        .isEmail()
        .withMessage("Email must be valid."),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password must be included.")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const existing = await User.findOne({ email });
        if (!existing) {
            throw new BadRequestError(`Invalid username or password.`);
        }
        
        const passwordsMatch = await Password.compare(
            password,
            existing.password
        );

        if (!passwordsMatch) {
            throw new BadRequestError("Invalid username or password.");
        }

        const userJwt = jwt.sign({
            id: existing.id,
            email: existing.email
        }, process.env.JWT_KEY!);

        req.session = {
            jwt: userJwt
        };

        res.status(200).send(existing);
    }
);

export { router as signinRouter };