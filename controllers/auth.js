import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import blacklistedTokens from '../models/blacklistedTokens.js';

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user object with default role 'user'
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'user',
        });

        // Set role as 'admin' if the email matches the salon owner's email
        if (email === 'owner@example.com') {
            newUser.role = 'admin';
        }

        // Save the new user to the database
        await newUser.save();

        // Optionally generate a token for immediate login after signup
        const token = jwt.sign({ userId: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully', token, user: newUser });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);


    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            console.log("invalid user or password");
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in the environment variables');
        }
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error("the error we are getting is",error.message);
        res.status(500).json({ error: 'Error logging in' });
    }
};

const getAllUsers = async (req , res)=>{
    try {
        const users  = await User.find({});
        res.status(200).json(users);

    } catch (error) {
        console.error("Error fetching users", error.message)
        res.status(500).json({message : "internal server error"});
    }

}
const updateUser = async (req, res) => {
    console.log(req.body); // To check the body data

    const { name, email } = req.body; // Extract name and email from body
    const { userId } = req.user; // Extract userId from the authenticated user
    const profilePhoto = req.file ? req.file.path : null; // Check if file exists and get the file path

    console.log("User ID from authenticate user is:", userId);

    try {
        // Prepare the data to update
        console.log("In the update try block");

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (profilePhoto) updateData.profilePhoto = profilePhoto; // Update profile photo if available

        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData }, // Correct operator to set new data
            { new: true } // Return the updated document
        );

        // Check if the user was found and updated
        if (!updatedUser) {
            console.log("User not found");
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with success
        res.status(200).json({ 
            message: 'Profile updated successfully', 
            user: updatedUser 
        });
        console.log("Profile updated successfully");
    } catch (error) {
        // Handle errors
        res.status(500).json({ 
            message: 'Error updating profile', 
            error: error.message 
        });
    }
};

const updatePassword = async (req, res) =>{
    const { currentPassword, newPassword } = req.body;
 console.log(req.body);
    try {
        const {userId} = req.user;
        console.log("current user id is:",userId);
      // Access user ID from `req.user` set by `authenticateUser` middleware
      const user = await User.findById(userId);
      console.log("user is found ", user);
      console.log("user password (hashed", user.password)

  
      if (!user) {
        
        return res.status(404).json({ message: "User not found" });
      }
  
      // Verify the current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      console.log("password mismatch result ", isMatch)
      if (!isMatch) {
        console.log("current passwrod is incorrect");

        return res.status(400).json({ message: "Current password is incorrect" });
      }
  
      // Hash the new password and update the user record
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error changing password: in controller", error.message);
      res.status(500).json({ message: "Server error" });
    }
  
}

const logout =async ( req , res)=>{
    console.log("request body in the logout function" , req.body);
    const token = req.header('Authorization')?.replace('Bearer','');
    console.log(token);
    if(token){
        blacklistedTokens.add(token);
        return res.status(200).json({message :'Logged out successfully'});
    }
    res.status(400).json({error : 'token not provided'});

}


const getCurrentUser = async (req, res) => {
    const { userId } = req.user; // Extract user ID from the token payload
    console.log("User ID from token:", userId);

    try {
        // Fetch the user from the database
        const currentUser = await User.findById(userId).select('name email role profilePhoto'); // Exclude sensitive fields

        if (!currentUser) {
            console.log("User not found");
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the user details
        res.status(200).json({
            message: 'Current user info fetched successfully',
            user: currentUser,
        });
    } catch (error) {
        console.error("Error fetching the current user:", error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};


export { signup, login , getAllUsers , updateUser , updatePassword , logout , getCurrentUser};
