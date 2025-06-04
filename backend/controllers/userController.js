const express=require("express");
const userModel=require("../models/userModel");
const bcrypt=require("bcrypt");
const {generateToken}=require("../middleware/authMiddleware")

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email ||!password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const existingUser = await userModel.userByGmail(email);
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await userModel.createUser(name, email, hashPassword);

        return res.status(201).json({ 
            message: "User created successfully."
        });
    } catch (error) {
        console.error('Error during user registration:', error);
        return res.status(500).send('Internal Server Error');
    }
};

//login user
const loginUser=async(req,res)=>{
    const{email,password}=req.body;
    try {
        const user=await userModel.userByGmail(email);
        console.log("Retriev user",user);
        
        if(!user){
          return res.status(404).send("User not found")
        } 
        const isMatch=await userModel.comparePass(password,user.password);
        console.log('Password match:', isMatch);
        if (!isMatch) return res.status(401).send("Password not match!");

        const payload={
            email:user.email,
            id:user.id,
        }
        console.log("The given payload is",payload);
        
       const token=generateToken(payload);
       console.log("The Login token is",token);
       return res.status(200).json({message:"Login Sucessfull",token:token});
        } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error');
    }
   
}

const userProfile = async (req, res) => {
    try {
        console.log('Profile endpoint called, user from token:', req.user);
        const userEmail = req.user.email; // Extract user ID from JWT payload

        // Fetch user details from the database
        const user = await userModel.userByGmail(userEmail);
        if (!user) {
            return res.status(404).json({ message: 'User does not exist.' });
        }

        const { name, email,} = user;

        return res.status(200).json({
            name,
            email,
        });
    } catch (error) {
          console.error("Error fetching profile:", error);
          res.status(500).json({ message: "Server error" });
        }
};

module.exports={
    loginUser,
    registerUser,
    userProfile
}