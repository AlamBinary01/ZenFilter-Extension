const Joi = require('@hapi/joi');
const User = require('../models/authenticationM');

const authentication = (server) => {
    // API route to get all users
    server.route({
        method: 'GET',
        path: '/api/users',
        handler: async (request, h) => {
            try {
                const users = await User.find();
                return h.response(users).code(200);
            } catch (error) {
                console.error(error);
                return h.response('Internal Server Error').code(500);
            }
        },
    });

    // API route to create a new user
    server.route({
        method: 'POST',
        path: '/api/users',
        handler: async (request, h) => {
            try {
                console.log('Received payload:', request.payload);

                const { name, email, password } = request.payload;

                // Custom validation for password length
                if (password.length < 8 || password.length > 13) {
                    console.log('Invalid password length');
                    return h.response('Password must be between 8 and 13 characters').code(400);
                }

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
    server.route({
        method: 'POST',
        path: '/api/login',
        handler: async (request, h) => {
            try {
                const { email, password } = request.payload;
                const user = await User.findOne({ email });
                if (!user) {
                    console.log('User not found');
                    return h.response('Invalid email or password').code(401);
                }
                if (user.password !== password) {
                    console.log('Invalid password');
                    return h.response('Invalid email or password').code(401);
                }
                console.log('Login successful');
                return h.response('Login successful').code(200);
            } catch (error) {
                console.error('Error during login:', error.message);
                return h.response('Internal Server Error').code(500);
            }
        },
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().min(8).max(13).required(),
                }),
            },
        },
    });

};

module.exports = authentication;
