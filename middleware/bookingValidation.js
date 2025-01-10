const validateBookingRequest = (req, res, next) => {
    const { serviceId, clientId, date, timeSlot } = req.body;

    if (!serviceId) {
        return res.status(400).json({ error: 'Service ID is required' });
    }
    if (!clientId) {
        return res.status(400).json({ error: 'Client ID is required' });
    }
    if (!date) {
        return res.status(400).json({ error: 'Date is required' });
    }
    if (!timeSlot) {
        return res.status(400).json({ error: 'Time slot is required' });
    }

    next(); // If all validations pass, proceed to the controller
};

export default validateBookingRequest;
