const emailValidator = require("deep-email-validator");
const mongoose = require('mongoose');

// Define the validate function
const validate = async (email) => {
    const { valid } = await emailValidator.validate(email);
    return valid;
}

const feedbackSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Bad', 'Good', 'Excellent', 'Outstanding'],
        required: true 
    },
    email: {
        type: String,
        required: true 
    },
    comment:{
        type: String,
        required: true 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the model and feedback handling functions together
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = {
    Feedback,
    feedback: async (req, res) => {
        const { email, category, comment } = req.body;
        if (!await validate(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        const newFeedback = new Feedback({
            email,
            category,
            comment
        });
        try {
            const savedFeedback = await newFeedback.save();
            res.status(201).json(savedFeedback);
        } catch (error) {
            res.status(500).json({ error: 'Error saving feedback to the database' });
        }
    },
    hello: (req, res) => {
        res.send("hello")
    }
}
