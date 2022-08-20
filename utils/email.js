// import module
require('dotenv').config();
const nodemailer = require('nodemailer')

// declared variables
const host = process.env.EMAIL_HOST // email provider 
const fromEmail = process.env.EMAIL_FROM // email sender user
const fromEmailPass = process.env.EMAIL_PASS // email sender password

const sendEmail = async (text,subject,toEmail) => {
    const transporter = nodemailer.createTransport({
        host: host,
        port: 587,
        secure: false,
        requireTLS: true,
        auth : {
            user : fromEmail,
            pass : fromEmailPass
        },
        tls: { 
            minVersion: 'TLSv1',
            rejectUnauthorized: false,
        }
    });
    const emailOptions = {
        from : fromEmail,
        to : toEmail,
        subject : subject,
        text : text,
    }
    return new Promise((resolve,reject) => {
        transporter.sendMail(emailOptions,(error,info) => {
            if (error)
            {
                console.log(error)
                reject()
            };
            console.log('email was sent')
            resolve()
        })
    })
}

module.exports = sendEmail;