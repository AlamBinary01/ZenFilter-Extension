const express = require("express");
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "odwnfadsknkpdwngipwnvpwjiwon82748327fewiu34298332jpndvnndknd"; // Moved to environment variable
const emailValidator = require("deep-email-validator");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect("mongodb+srv://subhan:33263766s@cluster0.ykfogwt.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true })
    .then(() => console.log("Connected To Database"))
    .catch(e => console.log("Database connection error:", e));

app.listen( 5000, () => {
    console.log(`Server started on port ${5000}`);
});
app.use(cors());

// Alternatively, configure CORS for specific origins
app.use(cors({
  origin: 'http://localhost:5000/login'  // Assuming your React app is hosted on this port
}));

const loginHistorySchema = new mongoose.Schema({
    datetime: { type: Date, default: Date.now },
    ip: String,
    hostname: String
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    blockedUrls: [String],
    customPreferences: [String],
    loginHistory: [loginHistorySchema]
});



const User = mongoose.model("UserInfo", userSchema);

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const emailValidation = await emailValidator.validate({ email });
        if (!emailValidation.valid) {
            return res.status(400).json({ error: "This email does not exist" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User does not exist." });
        }
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
            user.loginHistory.push({ datetime: new Date(), ip: req.ip, hostname: req.hostname });
            await user.save();
            return res.json({ status: "ok", data: token });
        }
        return res.status(401).json({ status: "error", error: "Invalid Password" });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ status: "error", error: "Server Error" });
    }
});
