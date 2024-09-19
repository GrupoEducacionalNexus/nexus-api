// services/send-email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    pool: true, // Reutilização de conexão com pool
});

const enviarEmail = async (to, subject, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        throw error;
    }
}

module.exports = enviarEmail;
