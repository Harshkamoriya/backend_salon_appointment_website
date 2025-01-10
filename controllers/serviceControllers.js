import Service from "../models/service.js";
import mongoose from "mongoose";

// Get all services
const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Error fetching services" });
  }
};

// Add a new service
const postServices = async (req, res) => {
  const {  name, description, price, imageUrl } = req.body;
  
  // Validate input
  if ( !name || !description || !price || !imageUrl) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newService = new Service({ name, description, price, imageUrl });
    await newService.save();
    res.status(201).json({ message: "Service added successfully", newService });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error adding service" });
  }
};

// Update a service by custom id (if not using MongoDB's _id)
const updateService = async (req, res) => {
  const { id } = req.params; // Assuming you're using custom 'id' field
  const { name, description, price, imageUrl } = req.body;
  console.log(req.body);
  console.log(req.params);
  
  try {
    const service = await Service.findOneAndUpdate(
      { _id:id }, // Use the custom 'id' field here
      { name, description, price, imageUrl },
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    
    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error updating service" });
  }
};

// Delete a service by custom id (if not using MongoDB's _id)

const deleteService = async (req, res) => {
  const { id } = req.params; // Assuming you're using custom 'id' field
  console.log("ID received is:", id);

  try {
    // Validate ObjectId if using MongoDB's _id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const service = await Service.findOneAndDelete({ _id: id }); // Use _id or your custom id field

    if (!service) {
      console.log("Service not found for ID:", id);
      return res.status(404).json({ error: "Service not found" });
    }

    console.log("Service deleted successfully:", service);
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error.message);
    res.status(500).json({ error: "Error deleting service" });
  }
};


export { getServices, postServices, deleteService, updateService };
