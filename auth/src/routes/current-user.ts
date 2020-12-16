import express from 'express';

import { currentUser } from '@ernticketing/common';

const router = express.Router();

router.get("/api/users/current", currentUser, (req, res) => {
    res.send({ currentUser: req.user || null });
});

export { router as currentUserRouter };