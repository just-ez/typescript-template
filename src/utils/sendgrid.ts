const { SENDGRID_API_KEY, VERIFIED_EMAIL, SENDGRID_TEMP_ID_2, SENDGRID_TEMP_ID_1 } = require("../core/config");
const sgMail = require("@sendgrid/mail");
const moment = require("moment");
sgMail.setApiKey(SENDGRID_API_KEY);
const { logger } = require("../utils/logger");
const { cacheData } = require("../service/Redis");
const { log } = require("winston");

const verificationCode = Math.floor(100000 + Math.random() * 100000);
// console.log(SENDGRID_TEMP_ID_1, SENDGRID_TEMP_ID_2);
async function 
sendEmailToken(Email: string, token: number | string, name?: string) {
  const msg = {
    to: Email, // Change to your recipient
    from: VERIFIED_EMAIL, // Change to your verified sender
    subject: "Activation Token",
    dynamic_template_data: {
        "name": name,
        "token": token
    },
    template_id: 'd-a7d8960092dd439ea87ca7f7715d7b25',
  };
  return sgMail
    .send(msg)
    .then((result: any) => {
      console.log({ result });
    })
    .catch((error: any) => {
      console.error(error);
      if (error.response) {
        const { response } = error;
        const { body } = response;
        return body
      }
    });
}



async function sendEmailVerificationToken(email: string) {
  try {
    const verificationCode1 = Math.floor(100000 + Math.random() * 100000);
  return await sendEmailToken(email, verificationCode1);

 
  } catch (error: any) {
    logger.error("Error occurred sending token", error);
    return {
      message: `Error occurred sending OTP Message to ${email}`,
      data: error.message,
      status: 500,
    };
  }
}

module.exports = {
  sendEmailVerificationToken,
};
