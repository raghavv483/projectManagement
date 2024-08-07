const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv").config();
const bcrypt=require("bcrypt");


const userSchema=mongoose.Schema({
    userProject:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: [true, 'fullname is required'],
        trim: true,
        index: true
    },
    password: {
        type:String,
        required: [true, 'password is required'],
    },
    refresh_token:{
        type:String,
    },

},{
    timestamp:true
});
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    //console.log("pre ",this.password);
    next();
});

userSchema.methods = {
     comparePassword : async function(plainTextPassword) {  
        try {  
            if (!this.password || !plainTextPassword) {  
                throw new Error('Missing password(s) for comparison');  
            }  
    
            // Compare hashed password with the plaintext  
            const isMatch = await bcrypt.compare(plainTextPassword, this.password);  
         //   console.log(this.password,plainTextPassword)
            console.log(isMatch); // true if passwords match, false otherwise  
            return isMatch; // Return the result of comparison  
        } catch (error) {  
            console.error('Error comparing passwords:', error);  
            return false; // or throw the error based on your preference  
        }  
    },
    generateAccessToken: function(){
    return jwt.sign(
        
        {
        _id: this._id,
        email:this.email,
        fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "10d"
        }
    )
},
    generateRefreshToken: function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "1d"
        }
    )
},
}

module.exports = mongoose.model('User', userSchema);  
