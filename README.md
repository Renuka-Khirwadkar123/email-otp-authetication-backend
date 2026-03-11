# Backend - Email OTP Authentication

Express.js server handling OTP generation, email delivery, and verification.

## 📖 Files

- **server.js** - Main Express application with API routes
- **automation.js** - Browser automation testing script using Playwright
- **package.json** - Backend dependencies
- **.env.example** - Environment variables template

## 🚀 Running Locally

```bash
npm install
npm start
```

Server runs on `http://localhost:3000`

## 🔗 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Serves login page |
| POST | `/send-otp` | Generates and sends OTP via email |
| POST | `/verify-Otp` | Verifies the submitted OTP |
| GET | `/test-email` | Tests email configuration |

## 🔐 Configuration

Create a `.env` file from `.env.example`:

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
PORT=3000
NODE_ENV=development
```

## 📧 Email Setup

The server uses Gmail's SMTP service via Nodemailer.

**Prerequisites:**
1. Google Account with 2FA enabled
2. Generate App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use the app password in `.env` (NOT your Gmail password)

## 🧪 Testing

Run the automation test:
```bash
node automation.js
```

This launches a browser, automatically fills forms, captures OTP from logs, and completes the verification flow.

## 📝 Notes

- OTP is 6 digits and stored in memory
- OTP resets when server restarts
- For production, add a database for persistent storage
- Nodemailer transporter is configured for Gmail only# email-otp-authetication-backend
