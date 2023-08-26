import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import ENV from '../config.js';

let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: ENV.EMAIL,
        pass: ENV.PASSWORD,
    }
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})

/** POST: http://locahost:8080/api/registerMail
 * @param : {
    "username" : sri123,
    "password" : sri123,
    "text" : "",
    "subject" : "",
}
*/

export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;

    // body of the mail
    var email = {
        body: {
            name: username,
            intro: text || 'Welcome Too You Guyss to My First Codeboard',
            outro: 'Need help, or have questions? Just feel free to Connect with us',

        }
    }

    var emailBody = MailGenerator.generate(email);

    let message = {
        from: ENV.EMAIL,
        to: userEmail,
        subject: subject || "SignUp Successfull !",
        html: emailBody
    }


    // send email
    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send({ msg: "Someone From Us Will Shortly Connect With you !" })
        })
        .catch(error => res.status(500).send({ error }))
}