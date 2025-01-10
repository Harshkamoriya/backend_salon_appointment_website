import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Changed 'username' to 'name' to match your signup code
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },  // Added password field
    role: { type: String, default: 'user' },  // Added role field with default value
    profilePhoto :{type : String}
});

const User = mongoose.model('User', userSchema);
export default User;
