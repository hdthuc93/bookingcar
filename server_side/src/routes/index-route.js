import express from 'express';
import infoRoute from './info-route';
import userRoute from './user-route'
import bookingRoute from './booking-route';

const router = express.Router();

router.use('/info', infoRoute);
router.use('/users', userRoute);
router.use('/booking', bookingRoute);

export default router;