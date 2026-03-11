// Core modules and dependencies
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require("express");
const cors = require('cors');
const readline = require("readline");

// Load email credentials from credentials.json (expects { emailUser, emailPass })
// const credentials = JSON.parse(fs.readFileSync("credentials.json"));
const nodemailer = require("nodemailer");

// Express app and configuration
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for the currently generated OTP.
// Note: This is ephemeral and will reset if the server restarts.
let currentOTP = "";

// Utility: generate a 6-digit numeric OTP as a string
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Configure Nodemailer transporter using Gmail and loaded credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
    }
});

// Helper: send OTP email to the recipient
async function sendEmail(toEmail, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}. It is valid for 5 minutes.`
  };
  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.messageId);
}

// Middleware to parse JSON, parse URL-encoded form bodies, and enable CORS
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// API health-check route (returns JSON instead of serving HTML)
app.get("/", (req, res) => {
  res.json({ message: "OTP Authentication Backend is running" });
});

// Route: receive email address, generate OTP, email it, then return success
app.post("/send-otp", async (req, res) => {
  const email = req.body.email;
  const otp = generateOTP();
  currentOTP = otp; // store current OTP for later verification

  console.log("Email:", email);
  console.log("OTP_GENERATED:", otp);

  try {
    await sendEmail(email, otp);
    // After successful send, return success response
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    // If sending fails, return a 500 with error message
    res.status(500).json({ success: false, message: "Failed to send OTP. Please check server credentials and try again." });
  }
});

// Route: verify submitted OTP against the one stored in memory
app.post("/verify-otp", (req, res) => {
  const userOtp = req.body.otp;
  if (userOtp === currentOTP) {
    // OTP matches: return success
    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } else {
    // OTP mismatch: return error
    res.status(401).json({ success: false, message: "Invalid OTP" });
  }
});

// Quick route to test email transporter configuration without sending an email
app.get("/test-email", async (req, res) => {
  try {
    await transporter.verify();
    res.send("Transporter ready! Email config works.");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

// Run locally only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;