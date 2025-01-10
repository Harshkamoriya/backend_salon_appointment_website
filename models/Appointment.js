import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, required: true },
  contact: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  service :{ type : String , required: true},
  status: {
    type: String,
    enum: ["pending", "confirmed"],
    default: "pending",
  },
  razorpayOrderId:String,
  razorpayPaymentId:String,
  paymentStatus :{
    type:String,
    enum :['pending', 'confirmed'],
    default :'pending'
  }
});

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", AppointmentSchema);

export default Appointment;
