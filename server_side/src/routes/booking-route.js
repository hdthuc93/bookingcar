import express from 'express';
import bookingCtrl from '../controllers/booking-controller';


const router = express.Router();

router.route('/')
    .post(
        bookingCtrl.create
    );

export default router;
