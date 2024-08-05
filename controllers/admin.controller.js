const express = require('express');  
const router = express.Router();  
const User=require("../models/user")
const bcrypt=require("bcrypt");
const JWT=require("jsonwebtoken");
const mongoose=require("mongoose");
const ApiResponse=require("../utils/apiResponse");
const ApiError=require("../utils/apiError");
require("../middlewares/admin.middleware");

const adminEmails = [process.env.ADMIN1, 
    process.env.ADMIN2,
    process.env.ADMIN3,
    process.env.ADMIN4,
    process.env.ADMIN5,
];

const adminlogin = async function(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(404, 'Something went wrong');
        }

        if (!adminEmails.includes(email)) {
            throw new ApiError(401, 'Invalid admin email');
        }

     
        res.status(200).json({ message: 'Login successful', success: true });
    } catch (error) {
        next(error); 
    }
}

module.exports={adminlogin};
