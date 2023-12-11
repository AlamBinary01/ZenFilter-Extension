const Hapi = require('@hapi/hapi');
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

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    try {
        await mongoose.connect('mongodb+srv://zenfiltersoftware:hello@cluster0.rnppymq.mongodb.net/test');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }

    server.route({
        method: 'GET',
        path: '/api/users',
        handler: async (request, h) => {
            try {
                const users = await User.find();
                return h.response(users).code(200);
            } catch (error) {
                console.error('Error retrieving users:', error.message);
                return h.response('Internal Server Error').code(500);
            }
        },
    });

    server.route({
        method: 'POST',
        path: '/api/users',
        handler: async (request, h) => {
            try {
                console.log('Received payload:', request.payload);

                const { name, email, password } = request.payload;
                const existingUser = await User.findOne({ email });

                if (existingUser) {
                    console.log('User with this email already exists');
                    return h.response('User with this email already exists').code(400);
                }

                const newUser = new User({ name, email, password });
                await newUser.save();

                console.log('User created successfully:', newUser);
                return h.response(newUser).code(201);
            } catch (error) {
                console.error('Error creating user:', error.message);
                return h.response('Internal Server Error').code(500);
            }
        },
        options: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().min(3).required(),
                    email: Joi.string().email().required(),
                    password: Joi.string().min(8).max(13).required(),
                }),
            },
        },
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    process.exit(1);
});

init();
