const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    pool: true,
});

const enviarEmail = (to, subject, text) => {
    try {
        var mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,  
            text: text, 
            html: `<b>${text}</b>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return;
            }
            console.log('Message sent: ' + info.response);
            return;
        });
    } catch (error) {
        return error;
    }
}

module.exports = enviarEmail;