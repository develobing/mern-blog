// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, text }) => {
  console.log('to, subject, text ', to, subject, text);

  const msg = {
    to,
    from: process.env.SENDGRID_FROM,
    subject,
    text,
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };

  return sgMail.send(msg);
};

module.exports = sendEmail;
