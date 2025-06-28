// utils/sendEmail.js
const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const ses = new AWS.SES();

async function sendEmail(toEmail, subject, message) {
  const params = {
    Destination: {
      ToAddresses: [toEmail]
    },
    Message: {
      Body: {
        Text: { Data: message }
      },
      Subject: { Data: subject }
    },
    Source: process.env.SES_VERIFIED_EMAIL
  };

  return ses.sendEmail(params).promise();
}

module.exports = sendEmail;
