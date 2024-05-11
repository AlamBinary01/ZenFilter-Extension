const multer = require("multer")
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const BugReport = mongoose.model('BugReport', new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    severity: {
        type: String,
        required: true,
        enum: ['Low', 'Medium', 'High', 'Critical']
    },
    screenshot: {
        type: String,
        required: false
    }
}, { timestamps: true }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'vida60@ethereal.email',
        pass: 's44AfzTx8c49hppg7r'
    }
});

module.exports = {
    report: (upload.single('screenshot'), async (req, res) => {
        try {
            const { name, email, description, severity } = req.body;
            const screenshotPath = req.file ? req.file.path : undefined;

            const newBugReport = new BugReport({
                name,
                email,
                description,
                severity,
                screenshot: screenshotPath
            });
            await newBugReport.save();
            const mailOptions = {
                from: email,
                to: 'zenfilter.software@gmail.com',
                subject: 'Bug Report Submission',
                text: `A new bug has been reported by ${name} (${email}).\n\nDescription: ${description}\nSeverity: ${severity}`,
                attachments: [{
                    filename: req.file.originalname,
                    path: req.file.path
                }]
            };
            await transporter.sendMail(mailOptions);

            res.status(201).send('Bug reported successfully and email sent.');
        } catch (error) {
            console.error('Error:', error);
            res.status(400).send(error.message);
        }
    })
}