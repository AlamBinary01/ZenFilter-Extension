  const express = require("express");
  const app = express();
  const mongoose = require('mongoose');
  const mongoURL = "mongodb+srv://subhan:33263766s@cluster0.ykfogwt.mongodb.net/?retryWrites=true&w=majority";
  const cors = require("cors");
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  const JWT_SECRET = "odwnfadsknkpdwngipwnvpwjiwon82748327fewiu34298332jpndvnndknd";
  const emailValidator = require("deep-email-validator");
  var nodemailer = require("nodemailer");

  app.set("view engine", "ejs");
  app.use(express.urlencoded({extended:false}));

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
    blockedUrls: [String],
    customPreferences: [String],
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

  app.post("/forgotPassword", async(req,res) => {
    const {email} = req.body;
    try {
      const oldUser = await User.findOne({email});
      if(!oldUser)
      {
        return res.json({status:"User do not exist"});
      }
      const secret = JWT_SECRET + oldUser.password;
      const token = jwt.sign({email: oldUser.email, id: oldUser._id }, secret, {
        expiresIn:"5m",
      });

      const link = `http://localhost:5000/resetPassword/${oldUser._id}/${token}`;
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'f201121@cfd.nu.edu.pk',
          pass: 'kwsa uqzc izco tfkj'
        }
      });
      
      var mailOptions = {
        from: 'youremail@gmail.com',
        to: email,
        subject: 'Reset your password',
        text: link
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      console.log(link);
    } catch (error) {}
  });

  app.get("/resetPassword/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    console.log(req.params);

    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User does not exist" });
    }

    const secret = JWT_SECRET + oldUser.password;

    try {
      const verify = jwt.verify(token, secret);
      res.render("index", { email: verify.email, status: "Verified" });
    } catch (error) {
      res.render("index", { status: "Not Verified" });
    }
  });

  app.post("/resetPassword/:id/:token", async(req,res) => {
    const {id, token} = req.params;
    const {password} = req.body;

    const oldUser = await User.findOne({_id:id});
    if(!oldUser)
    {
      return res.json({status:"User does not exist"});
    }

    const secret = JWT_SECRET + oldUser.password;

    try {
      const verify = jwt.verify(token,secret);
      const encryptPass = await bcrypt.hash(password,10);
      await User.updateOne(
        {
          _id: id,
        },
        {
          $set:{
            password : encryptPass,
          },
        }
      );
      res.json({status:"Password Updated"});
      //res.render("index", {email:verify.email})
      res.send("Verified");
    } catch (error) {
      res.json({status:"Something went wrong"});
    }

  })

  app.post("/addBlockedUrl", async (req, res) => {
    const { email, url } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      // Avoid duplicate URLs
      if (!user.blockedUrls.includes(url)) {
        user.blockedUrls.push(url);
        await user.save();
      }

      res.status(200).send({ status: "ok", data: "URL added to blocked list" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "error", error: "Server error" });
    }
  });

  app.post("/getBlockedUrls", async (req, res) => {
    // Assuming you're passing the token in the request's Authorization header
    const token = req.headers.authorization.split(" ")[1]; // Extract token from Bearer token format

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userEmail = decoded.email;

      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).send({ status: "error", error: "User not found" });
      }

      // User found, return their blocked URLs
      res.status(200).send({ status: "ok", blockedUrls: user.blockedUrls });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "error", error: "Failed to retrieve blocked URLs" });
    }
  });

  app.post("/deleteBlockedUrl", async (req, res) => {
    const { email, url } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      // Remove URL from user's blockedUrls array
      user.blockedUrls = user.blockedUrls.filter((blockedUrl) => blockedUrl !== url);
      await user.save();

      res.status(200).send({ status: "ok", data: "URL removed from blocked list" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "error", error: "Server error" });
    }
  });


  app.post("/addCustomPreference", async (req, res) => {
    const { email, customPreference } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      // Avoid duplicate preferences
      if (!user.customPreferences.includes(customPreference)) {
        user.customPreferences.push(customPreference);
        await user.save();
      }

      res.status(200).send({ status: "ok", message: "Custom preference added" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "error", error: "Server error" });
    }
  });

  // Fetch custom preferences
  app.post("/getCustomPreferences", async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]; // Extract token

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userEmail = decoded.email;

      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).send({ status: "error", error: "User not found" });
      }

      // User found, return their custom preferences
      res.status(200).send({ status: "ok", customPreferences: user.customPreferences });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "error", error: "Failed to retrieve custom preferences" });
    }
  });

  app.post("/deleteCustomPreference", async (req, res) => {
    const { email, customPreference } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
  
      // Remove the custom preference from the user's customPreferences array
      const updatedCustomPreferences = user.customPreferences.filter(preference => preference !== customPreference);
      user.customPreferences = updatedCustomPreferences;
      await user.save();
  
      res.status(200).send({ status: "ok", message: "Custom preference deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "error", error: "Server error" });
    }
  });
  



app.post('/fetchImage', async (req, res) => {
  const { imageUrl } = req.body;
  console.log('Fetching image URL:', imageUrl); // Debugging: Log the URL being fetched

  // Ensure imageUrl is not undefined, null, or empty
  if (!imageUrl || typeof imageUrl !== 'string') {
    return res.status(400).send({ status: "error", error: "Invalid or missing imageUrl" });
  }

  try {
    // Ensure you're using dynamic import for fetch if you're in a CommonJS module
    if (!fetch) {
      fetch = (await import('node-fetch')).default;
    }

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const buffer = await response.buffer();
    const contentType = response.headers.get('Content-Type') || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*', // Allowing CORS
    });
    res.end(buffer);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send({ status: "error", error: "Failed to fetch image" });
  }
});

  