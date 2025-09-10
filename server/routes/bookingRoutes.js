const express = require("express");
const router = express.Router();

const{createBooking,getCustomerBookings,getBookingByReference,updateBookingStatus,cancelBooking} = require('../controllers/bookingController')

router.post('/', createBooking);
router.get('/:customer_id', getCustomerBookings);

router.get('/reference/:reference', getBookingByReference);
router.patch('/:reference/status', updateBookingStatus);

router.delete('/:reference', cancelBooking);

module.exports= router;