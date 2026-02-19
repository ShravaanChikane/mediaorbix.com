// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows your HTML files to send data to this server
app.use(express.json()); // Parses incoming JSON data
app.use(express.urlencoded({ extended: true })); // Parses form data

// Configure the Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to 'smtp' and provide host details for custom domains
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// The Contact Form API Endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, service, message } = req.body;

    // Validate the incoming data
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please fill out all required fields.' });
    }

    // Format the email
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECEIVER_EMAIL, // Where you want to receive the leads
        subject: `New Lead from Mediaorbix: ${name} - ${service}`,
        text: `
            You have a new project inquiry!
            
            Name: ${name}
            Email: ${email}
            Service Needed: ${service}
            
            Message:
            ${message}
        `
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent from ${email}`);
        res.status(200).json({ success: 'Message sent successfully! We will be in touch.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Mediaorbix backend is running on http://localhost:${PORT}`);
});