import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  id: { type:String },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});

const Service =
  mongoose.models.service || mongoose.model("service", serviceSchema);

export default Service;
