import mongoose from "mongoose";

const bundleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Bundle Title is required'],
        trim: true,
    },
    subtitle: {
        type: String,
        required: [true, 'Bundle Subtitle is required'],
        trim: true,
    },
    tag: {
        type: String,
        default: "Bundle",
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be greater than 0"],
    },
    oldPrice: {
        type: Number,
        required: [true, "Old Price is required"],
        min: [0, "Old Price must be greater than 0"],
    },
    access: {
        type: String,
        default: "Instant access",
        trim: true
    },
    papersCount: {
        type: Number,
        default: 0
    },
    papers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Paper',
        },
    ],
}, { timestamps: true });

const Bundle = mongoose.models.Bundle || mongoose.model('Bundle', bundleSchema);

export default Bundle;