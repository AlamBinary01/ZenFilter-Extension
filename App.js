const express = require("express");
const app = express();
const mongoose = require('mongoose');
const mongoURL = "mongodb+srv://subhan:33263766s@cluster0.ykfogwt.mongodb.net/?retryWrites=true&w=majority";
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "odwnfadsknkpdwngipwnvpwjiwon82748327fewiu34298332jpndvnndknd";
const emailValidator = require("deep-email-validator");

app.use(cors());

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
})
  .then(() => {
    console.log("Connected To Database");
  })
  .catch((e) => console.log(e));

app.use(express.json());
app.listen(5000, () => {
  console.log("Server Started");
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("UserInfo", userSchema);

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const emailValidation = await emailValidator.validate({ email });

  if (!emailValidation.valid) {
    return res.send({ error: "This email does not exist" });
  }

  const encryptPass = await bcrypt.hash(password, 10);
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send({ error: "User Already Exists" });
    }

    await User.create({
      name,
      email,
      password: encryptPass,
    });

    res.send({ status: "ok" });
  } catch (error) {
    console.error(error);
    res.send({ status: "Error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const emailValidation = await emailValidator.validate({ email });

  if (!emailValidation.valid) {
    return res.send({ error: "This email does not exist" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.send({ error: "User does not exist." });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email }, JWT_SECRET);

      return res.json({ status: "ok", data: token });
    }

    return res.json({ status: "error", error: "Invalid Password" });
  } catch (error) {
    console.error(error);
    return res.json({ status: "error", error: "Server Error" });
  }
});

app.post("/userData", async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userEmail = decodedToken.email;

    const userData = await User.findOne({ email: userEmail });

    if (userData) {
      return res.send({ status: "ok", data: userData });
    } else {
      return res.send({ status: "error", error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.send({ status: "error", error: "Invalid Token" });
  }
});
