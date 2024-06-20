const Nodemailer = require('nodemailer');

const sendEmail = (email, textSubject, textMail) =>{
    var message = {
        from: 'edllaor77@gmail.com',
        to: `${email}`,
        subject: textSubject,
        text: textMail
    };
    
    var transporter = Nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
    });
    
    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.log("Error enviando email")
            console.log(error.message)
        } else {
            console.log("Email enviado")
        }
    })
}

module.exports = {
    sendEmail
}
