require("dotenv").config();
console.log("Loaded EMAIL_USER:", process.env.EMAIL_USER);  // debug
console.log("Loaded EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Exists" : "❌ Missing");

const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

// Parse form data and JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from "public" folder
app.use(express.static("public"));

// POST route to send emails
app.post("/send", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send("All fields are required.");
  }

  // Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use Gmail App Password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    replyTo: email, // ensures replies go to user
    to: "lethomeathman@gmail.com",
    subject: `Contact Form Message from ${name}`,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending message.");
    } else {
      console.log("Email sent: " + info.response);
      res.send("Message sent successfully!");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
