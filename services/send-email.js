const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "email-ssl.com.br",
    secure: true,
    port: 465,
    auth: {
        user: "naoresponda@enberuniversity.com",
        pass: "8D1@Zcek"
    },
    pool: true, // Reutilização de conexão com pool
});

const enviarEmail = async (to, subject, text) => {
    const mailOptions = {
        from: 'naoresponda@enberuniversity.com',
        to: to,
        subject: subject,
        text: text,
        html: `<b>${text}</b>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        return error;
    }
}

module.exports = enviarEmail;
