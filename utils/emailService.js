const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

module.exports = {
    sendWelcomeEmail: async (email) => {
        await transporter.sendMail({
            from: `Event Platform <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Welcome to Event Platform!',
            text: 'Your account has been successfully created!'
        });
    },

    sendRegistrationEmail: async (email, eventTitle) => {
        await transporter.sendMail({
            from: `Event Platform <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Event Registration Confirmation',
            text: `You have successfully registered for "${eventTitle}"`
        });
    }
};