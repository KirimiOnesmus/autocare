const express = require("express");
const router = express.Router();

const{createBooking,getCustomerBookings,getBookingByReference,updateBookingStatus,rescheduleBooking,cancelBooking,getBookingByBusiness} = require('../controllers/bookingController')

router.post('/', createBooking);
router.get('/:customer_id', getCustomerBookings);

router.get('/reference/:reference', getBookingByReference);
router.put('/:id/status', updateBookingStatus);
router.put('/id/reschedule',rescheduleBooking)

router.delete('/:reference', cancelBooking);

//business
router.get('/business/:businessId',getBookingByBusiness)

module.exports= router;