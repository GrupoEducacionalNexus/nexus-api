// services/emailService.js
const nodemailer = require('nodemailer');

const sendEmailNotification = async (to, subject, message) => {
    try {
        // Configuração do serviço de e-mail
        const transporter = nodemailer.createTransport({
            service: 'gmail', // ou outro serviço de e-mail
            auth: {
                user: process.env.EMAIL_USER, // Seu e-mail
                pass: process.env.EMAIL_PASS, // Sua senha ou App password
            },
        });

        // Detalhes do e-mail
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: message,
        };

        // Envio do e-mail
        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado: ', info.response);
    } catch (error) {
        console.error('Erro ao enviar o e-mail: ', error);
    }
};

module.exports = { sendEmailNotification };
