import { throwError }from "./handleErrors.js";
// const { resetPasswordMessage } = require("./messages");
// const { generateAuthToken } = require("../core/userAuth");

// const { s3 } = require("./aws");
// const { EMAIL_SENDER } = require("../core/config");
// const { error, success } = require("../utils/baseController");
// const msg = require("./sendgrid");

const validateParameters = (expectedParameters: any[], actualParameters: any[]) => {
  const messages: string[] = [];
  let isValid = true;

  if (!actualParameters) {
    throwError("Invalid Parameters");
  }

  expectedParameters.forEach((parameter) => {
    const actualParameter = actualParameters[parameter];

    if (!actualParameter || actualParameter === "") {
      messages.push(`${parameter} is required`);
      isValid = false;
    }
  });
  return { isValid, messages };
};



// exports.uploadResourceToS3Bucket = (params) => {
//   return s3
//     .upload(params)
//     .promise()
//     .then((data) => data.Location)
//     .catch((error) => {
//       if (error) {
//         throw error;
//       }
//     });
// };

// exports.getAttachmentSizeInMegabyte = (sizeInByte) => {
//   let sizeInMegaByte = sizeInByte / 1000000;
//   return +(Math.round(sizeInMegaByte + "e+3") + "e-3") + "mb";
// };

const performUpdate = async (
  updates: string[],
  newDetails: [],
  allowedUpdates: string[],
  oldDetails: any
) => {
  let invalidField;
  const isValidUpdate = updates.every((update: any) => {
    if (newDetails[update] === "")
      throwError(`Invalid value supplied for ${update}`);
    invalidField = update;
    return allowedUpdates.includes(update);
  });

  if (!isValidUpdate) {
    throwError(`Invalid Field ${invalidField}`);
  }

  updates.map((update: any) => {
    oldDetails[update] = newDetails[update];
  });

  return await oldDetails.save();
};

// exports.processForgotPassword = async (user: { _id: any; email: any; save: (arg0: { resetLink: any; }) => any; }, res: Response) => {
//   const token = await generateAuthToken({ userId: user._id });
//   const htmlMessage = resetPasswordMessage(token);
//   const mail = this.sendEmail(user.email, "Password Reset", htmlMessage);
//   const updatedUser = await user.save({ resetLink: token });
//   if (updatedUser) {
//     try {
//       const sendMessage = await msg.messages().send(mail);
//       if (sendMessage) {
//         return success(
//           res,
//           { status: "success", success: true, user: updatedUser },
//           "Check your email and follow the instruction to reset your password."
//         );
//       }
//     } catch (err: any ) {
//       return error(res, { code: 500, message: err.message });
//     }
//   }
// };


export default {
  validateParameters,
  performUpdate
}