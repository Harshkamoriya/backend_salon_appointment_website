import express from 'express';
import { availableSlots,
     bookSlots , 
     getappointments , 
     deleteappointment,
     deleteAppointmentsByDate,
     createRazorpayOrder, 
     verifyPayment,
     updateAppointmentStatus,
     rescheduleAppointment,
     getAppointmentByName
    
    } from '../controllers/appointmentController.js';

const router = express.Router();

const validateBookingRequest = (req, res, next) => {
    const {date, timeSlot } = req.body;

    
    if (!date) return res.status(400).json({ error: 'Date is required' });
    if (!timeSlot) return res.status(400).json({ error: 'Time slot is required' });

    next();
};

router.get("/details",getappointments)
router.delete("/delete" , deleteappointment)
router.delete("/delete-appointments-by-date" , deleteAppointmentsByDate)
router.put("/update-status" , updateAppointmentStatus);
router.put("/reschedule" , rescheduleAppointment)

router.get('/available-slots', availableSlots);
router.post('/book-slots', validateBookingRequest, bookSlots);
router.post('/create-razorpay-order' , createRazorpayOrder);
router.post('/verify-payment', verifyPayment);
router.get('/:name', getAppointmentByName)


router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

export default router;
