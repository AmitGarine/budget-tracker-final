const User = require("../models/Users");

exports.registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password }); // Assuming password hashing etc. is handled
        await newUser.save();
        res.status(201).json({
            message: "User registered successfully",
            userId: newUser._id  // Returning the user ID in the response
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.password === password) {  // Ideally, this should use hashed password comparison
            res.status(200).json({
                message: "Logged in successfully",
                userId: user._id  // Include userId in the response
            });
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};