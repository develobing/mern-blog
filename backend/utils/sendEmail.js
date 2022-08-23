// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
  const from = process.env.SENDGRID_FROM;

  const msg = {
    to,
    from,
    subject,
    text,
    html,
  };

  return sgMail.send(msg);
};

module.exports = sendEmail;
