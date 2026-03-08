import mongoose from "mongoose";

const paperSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Paper Title is required'],
        trim: true,
    },
    subject: {
        type: String,
        required: [true, 'Paper Subject is required'],
        trim: true
    },
    form: {
        type: String,
        required: [true, 'Paper Form is required'],
        trim: true
    },
    year: {
        type: Number,
        required: [true, 'Paper Year is required'],
    },
    type: {
        type: String,
        required: [true, 'Exam Type is required'],
        trim: true
    },
    price: {
        type: Number,
        default: 0,
        min: [0, 'Price cannot be negative']
    },
    isFree: {
        type: Boolean,
        default: false
    },
    hasMarkingScheme: {
        type: Boolean,
        default: false
    },
    fileUrl: {
        type: String,
        required: [true, 'Paper File URL is required'],
        trim: true
    },
    downloadsCount: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

const Paper = mongoose.models.Paper || mongoose.model('Paper', paperSchema);

export default Paper;