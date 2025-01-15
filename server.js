import express from"express";
import connectDB from "./config/connection.js";
import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/services.js";
import appointmentRoutes from "./routes/appointment.js";
import paymentRoutes from "./routes/appointment.js"
import dashroutes from "./routes/dashRoutes.js"


import dotenv from "dotenv";
import cors from "cors"

const app = express();
app.use(cors({
    origin: "http://localhost:5173" // Change this to your frontend URL
}));

app.use(express.json());

const port = 5000;



dotenv.config();
connectDB();

app.use('/auth', authRoutes);
app.use('/services', serviceRoutes);
app.use('/appointment',appointmentRoutes );
app.use('/payment', paymentRoutes);
app.use('/dashboard', dashroutes );



app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
}).on('error', (err) => {
    console.error(`Error starting server: ${err}`);
});
