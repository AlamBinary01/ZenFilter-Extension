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
  const fetch = require('node-fetch');

  function isValidPassword(password) {
    const passwordRegex = /^(?=.*\d.*\d)[a-zA-Z0-9]{8,}$/;
    return passwordRegex.test(password);
  }

  app.set("view engine", "ejs");
  app.use(express.urlencoded({extended:false}));

  app.use(cors({
    origin: "*", // Allow all origins (adjust in production)
    methods: ["GET", "POST", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
  

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

  const feedbackSchema = new mongoose.Schema({
    email: { type: String, required: true },
    category: { type: String, required: true },
    comment: { type: String, required: true }
  });
  
  const Feedback = mongoose.model("Feedback", feedbackSchema);

  const bugReportSchema = new mongoose.Schema({
    email: { type: String, required: true },
    description: { type: String, required: true },
    severity: { type: String, required: true },
    screenshot: String 
});

const BugReport = mongoose.model('BugReport', bugReportSchema);

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
      
      // Check if the URL is already blocked
      if (user.blockedUrls.includes(url)) {
        return res.status(400).send({ error: "URL already blocked" });
      }
      
      // Add the URL to the blockedUrls array
      user.blockedUrls.push(url);
      await user.save();
      
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
      res.status(200).send({ status: "ok", blockedUrls: user.blockedUrls, count: user.blockedUrls.length });
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
      res.status(200).send({ status: "ok", customPreferences: user.customPreferences, count: user.customPreferences.length });
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
    console.log('Fetching image URL:', imageUrl);
  
    if (!imageUrl || typeof imageUrl !== 'string') {
      return res.status(400).send({ status: "error", error: "Invalid or missing imageUrl" });
    }
  
    try {
      // Check if imageUrl is a data URL
      if (imageUrl.startsWith('data:')) {
        // Decode the data URL to a buffer
        const base64Data = imageUrl.split(';base64,').pop();
        const buffer = Buffer.from(base64Data, 'base64');
  
        // Assuming you want to send back the decoded image
        res.writeHead(200, {
          'Content-Type': 'image/png', // You might need to dynamically determine this based on the data URL
          'Access-Control-Allow-Origin': '*',
        });
        res.end(buffer);
      } else {
        // It's an HTTP(S) URL, proceed with fetching
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const buffer = await response.buffer();
        const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
  
        res.writeHead(200, {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
        });
        res.end(buffer);
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).send({ status: "error", error: "Failed to fetch image" });
    }
  });
  
  app.get('/uninstall', async (req, res) => {
    const userEmail = decodeURIComponent(req.query.email);

    // Ensure userEmail is sanitized and validated before use
    // Email sending logic as previously described
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'zenfilter.software@gmail.com',
            pass: 'xkqu lesf pwlk pljt'
        }
    });

    var mailOptions = {
        from: 'zenfilter.software@gmail.com',
        to: userEmail,
        subject: 'Zen-Filter is removed',
        text: 'Zen-Filter is removed from your browser.'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.send('Error sending email');
        } else {
          // Respond with styled HTML when email is successfully sent
          res.send(`
              <!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Uninstall Confirmation</title>
                  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap" rel="stylesheet">
                  <style>
                      body, html {
                          height: 100%;
                          margin: 0;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          background-color: #fff;
                      }
                      .message {
                          font-family: 'Montserrat', sans-serif;
                          font-weight: bold;
                          color: #F79817;
                          font-size: 44px;
                          text-align: center;
                      }
                      .message2 {
                          font-family: 'Montserrat', sans-serif;
                          font-weight: bold;
                          color: #000000;
                          font-size: 44px;
                          text-align: center;
                      }
                  </style>
              </head>
              <body>
                  <div class="message2">We are sorry to see you go...</div>
                  <br><br>
                  <div class="message">Uninstallation email has been sent</div>
              </body>
              </html>
          `);
      }
  });
});

app.post("/updateEmail", async (req, res) => {
  const { token, currentEmail, newEmail } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }

    if (user.email !== currentEmail) {
      return res.status(400).json({ status: "error", error: "Current email does not match." });
    }

    const emailValidation = await emailValidator.validate({ email: newEmail });
    if (!emailValidation.valid) {
      return res.status(400).json({ status: "error", error: "Invalid email format." });
    }

    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({ status: "error", error: "Email already in use." });
    }

    user.email = newEmail;
    await user.save();
    res.json({ status: "ok", message: "Email updated successfully." });
  } catch (error) {
    console.error("Error updating email:", error);
    res.status(500).json({ status: "error", error: "Server error" });
  }
});

app.post("/updatePassword", async (req, res) => {
  const { token, currentPassword, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ status: "error", error: "Current password is incorrect." });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ status: "error", error: "Invalid password format." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ status: "ok", message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ status: "error", error: "Server error" });
  }
});

// Assuming JWT_SECRET and User model are already defined as shown in your previous snippets

app.post("/deleteAccount", async (req, res) => {
  // Authenticate and decode the token
  const token = req.headers.authorization?.split(" ")[1]; // 'Bearer TOKEN_HERE'
  if (!token) {
      return res.status(401).json({ status: "error", error: "No authorization token provided" });
  }

  try {
      const decoded = jwt.verify(token, JWT_SECRET); // Verifies token and gets the decoded payload
      const user = await User.findOne({ email: decoded.email });

      if (!user) {
          return res.status(404).json({ status: "error", error: "User not found" });
      }

      // Delete the user from the database
      await User.deleteOne({ _id: user._id });
      res.json({ status: "ok", message: "Account successfully deleted" });
  } catch (error) {
      console.error("Error deleting account:", error);
      if (error.name === "JsonWebTokenError") {
          return res.status(401).json({ status: "error", error: "Invalid token" });
      }
      res.status(500).json({ status: "error", error: "Server error" });
  }
});

app.post("/feedback", async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ status: "error", error: "Authorization header is required" });
  }

  const token = req.headers.authorization.split(" ")[1]; // Assume the token is sent in the Authorization header
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email; // Assuming email is encoded in the token

    const { category, comment } = req.body;

    if (!userEmail || !category || !comment) {
      return res.status(400).json({ status: "error", error: "All fields are required" });
    }

    // Save feedback to MongoDB
    const newFeedback = new Feedback({ email: userEmail, category, comment });
    await newFeedback.save();

    // Send an email notification using the user's email
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'zenfilter.software@gmail.com', // This should be your service email
        pass: 'xkqu lesf pwlk pljt' // Your email password
      }
    });

    var mailOptions = {
      from: 'zenfilter.software@gmail.com',
      to: userEmail,
      subject: 'Feedback Received',
      text: `Thank you for your feedback! \nCategory: ${category} \nComment: ${comment}`
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.error('Failed to send feedback email:', error);
        return res.status(500).json({ status: "error", error: "Failed to send email" });
      }
      res.json({ status: "ok", message: "Feedback submitted successfully and email sent" });
    });
  } catch (error) {
    console.error('Failed to process feedback:', error);
    return res.status(500).json({ status: "error", error: "Failed to verify token or save feedback" });
  }
});

app.post("/reportBug", async (req, res) => {
  // Ensure the request contains the Authorization header
  if (!req.headers.authorization) {
      return res.status(401).json({ status: "error", error: "Authorization header is required" });
  }

  const token = req.headers.authorization.split(" ")[1];
  let userEmail;
  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userEmail = decoded.email; // Extract the email from the token
  } catch (error) {
      return res.status(401).json({ status: "error", error: "Invalid or expired token" });
  }

  const { description, severity, screenshot } = req.body; // Assuming these are the fields posted

  if (!description || !severity) {
      return res.status(400).json({ status: "error", error: "Description and severity are required" });
  }

  // Assuming BugReport is a mongoose model you've defined
  const newBugReport = new BugReport({
      email: userEmail,
      description,
      severity,
      screenshot // Optional, handling of screenshots must be implemented if needed
  });

  try {
      await newBugReport.save();

      // Setup nodemailer to send an email notification
      var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: 'zenfilter.software@gmail.com',
              pass: 'xkqu lesf pwlk pljt'
          }
      });

      var mailOptions = {
          from: 'zenfilter.software@gmail.com',
          to: userEmail, // Send to the user's email retrieved from the token
          subject: 'Bug Report Submitted',
          text: `Your bug report has been received:\nDescription: ${description}\nSeverity: ${severity}`
      };

      transporter.sendMail(mailOptions, function(error, info){
          if (error) {
              console.log(error);
              return res.status(500).json({ status: "error", error: "Failed to send email" });
          } else {
              res.json({ status: "ok", message: "Bug report submitted successfully and email sent" });
          }
      });
  } catch (error) {
      console.error('Error saving bug report:', error);
      res.status(500).json({ status: "error", error: "Failed to process bug report" });
  }
});

