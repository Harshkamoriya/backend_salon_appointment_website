import express from 'express';
import  { 
    getTotalRevenue ,
     getTotalAppointments , 
      getMostPopularService , 
      getNewCustomers , 
      getRevenueChart ,
       getAppointmentsChart,
        getNewCustomersChart
    } from "../controllers/dashboardController.js";


const router = express.Router();

router.get("/revenue", getTotalRevenue);
router.get("/total-appointments" ,getTotalAppointments );
router.get("/popular-service", getMostPopularService);
router.get("/new-customers", getNewCustomers);
router.get("/revenue-chart", getRevenueChart);
router.get("/appointments-chart",getAppointmentsChart);
router.get("/customers-chart", getNewCustomersChart)


export default router;
