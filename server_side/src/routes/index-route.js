import express from 'express';
import infoRoute from './info-route';
import userRoute from './user-route'

const router = express.Router();

router.use('/info', infoRoute);
router.use('/users', userRoute);

export default router;