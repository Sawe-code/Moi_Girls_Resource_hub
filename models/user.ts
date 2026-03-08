import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User Name is required'],
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        required: [true, "User Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /\S+@\S+\.\S+/,
            "Please provide a valid email address"
        ],
    },
    password: {
        type: String,
        required: [true, "User Password is required"],
        minLength: 6,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user' 
    },
    hasLoggedInBefore: {
        type: Boolean,
        default: false
    },
    lastLoginAt: {
        type: Date,
        default: null
    },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;