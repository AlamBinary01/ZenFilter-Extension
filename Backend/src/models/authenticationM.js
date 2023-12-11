const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => Joi.string().email().validate(value).error === null,
            message: 'Invalid email format',
        },
    },
    
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 13,
        validate: {
            validator: (value) => Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{8,13}$')).validate(value).error === null,
            message: 'Password must be 8-13 characters and include letters, numbers, and special characters (!@#$%^&*)',
        },
    },
    
});

const User = mongoose.model('User', userSchema);

module.exports = User;
