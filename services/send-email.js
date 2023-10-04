const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: "email-ssl.com.br",
    secure: true,
    port: 465,
    auth: {
        user: "naoresponda@enberuniversity.com",
        pass: "8D1@Zcek"
    },
    pool: true,
});

const enviarEmail = (to, subject, text) => {
    try {
        var mailOptions = {
            from: 'naoresponda@enberuniversity.com',
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