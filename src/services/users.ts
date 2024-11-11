import userSchema from "../models/userModel.js";
import { throwError } from "../utils/handleErrors.js";
import utils from "../utils/util.js";
import bcrypt from "bcrypt";
import constants from "../utils/constants.js";
import {
  flutterResponse,
  intializePayment,
} from "../integrations/flutterwave.js";

class User {
  data: any;
  error: string[];
  constructor(data: any) {
    this.data = data;
    this.error = [];
  }

  async checkEmailExists(email: string) {
    const userExists = await userSchema.findOne({ email });
    if (userExists) {
      this.error.push("Email Is Already Taken");
    }
    return { msg: "email available" };
  }

  async checkNumberExists(phoneNumber: string) {
    const userExists = await userSchema.findOne({ phoneNumber });
    if (userExists) {
      this.error.push("Phone Number Is Already Taken");
    }
    return { msg: "number available" };
  }

  async createUser() {
    const data = this.data;
    await Promise.all([
      this.checkEmailExists(data.email),
      this.checkNumberExists(data.phone),
    ]);
    if (this.error.length) {
      throwError(this.error);
    }
    if (data.isGoogleSigned && data.role === constants.USER_TYPE.USER) {
      data.isVerified = true;
    }
    const newUser = await userSchema.create(data);
    
    return newUser;
  }

  async login() {
    const { loginId, password } = this.data;
    const validParameters = utils.validateParameters(
      ["loginId", "password"],
      this.data
    );
    const { isValid, messages } = validParameters;

    if (!isValid) {
      throwError(messages);
    }
    return await userSchema.findByCredentials(loginId, password);
  }

  async activateUser() {
    const { token } = this.data;
    if (!token) {
      throwError("Please Input Your Token");
    }
    // const one = await userSchema.findOne({})
    const updateUser = await userSchema.findOneAndUpdate(
      {
        otp: token,
      },
      { otp: null, isVerified: true },
      { new: true }
    );
    if (!updateUser) {
      throwError("Invalid Token");
    }
    // await  registrationSuccessful(updateUser.firstName, updateUser.email);
    return updateUser;
  }

  async getAllUser() {
    return await userSchema
      .find()
      .sort({ createdAt: -1 })
      .orFail(() => throwError("No users found"));
  }

  async userProfile() {
    return await userSchema
      .findById(this.data)
      .orFail(() => throwError("No user found"));
  }

  async updateUserDetails() {
    const { newDetails, oldDetails } = this.data;
    const updates = Object.keys(newDetails);
    const allowedUpdates = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "state",
      "country",
      "city",
      "gender",
      "profilePicture",
      "validId",
      "cacDocument",
    ];
    return await utils.performUpdate(
      updates,
      newDetails,
      allowedUpdates,
      oldDetails
    );
  }

  async forgotPassword() {
    const { email } = this.data;
    const verificationCode = Math.floor(100000 + Math.random() * 100000);
    if (!email) {
      throwError("Please Input Your Email");
    }
    const updateUser = await userSchema.findOneAndUpdate(
      {
        email,
      },
      { otp: verificationCode },
      { new: true }
    );
    if (!updateUser) {
      return throwError("Invalid Email");
    }
    console.log(verificationCode);

    // await sendResetPasswordToken(
    //   updateUser.email,
    //   updateUser.firstName,
    //   updateUser.otp
    // );
    return updateUser;
  }

  async resetPassword() {
    const { otp, newPassword } = this.data;
    if (!otp || !newPassword) {
      throwError("Please Input Your Otp and New Password");
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    const updateUser = await userSchema.findOneAndUpdate(
      {
        otp,
      },
      { otp: null, password: hashed },
      { new: true }
    );
    if (!updateUser) {
      throwError("Invalid Otp");
    }
    // await SuccessfulPasswordReset(updateUser.firstName, updateUser.email);
    return updateUser;
  }

  async rateStore() {}

  async subscribeUser() {
    const { email, userId } = this.data;
    const user = await userSchema.findOne({ email });

    if (user && user.role === constants.USER_TYPE.BUSINESS)
      return await intializePayment(
        user.email,
        user.phone,
        user.firstName,
        userId
      );
  }

  async verifySubcription() {
    const { amount, tx_ref, transaction_id } = this.data;
    const flutter: any = await flutterResponse(amount, tx_ref, transaction_id);
    if (
      flutter.status == "successful" &&
      flutter.amount == amount &&
      flutter.currency === "NGN"
    ) {
      console.log(flutter.meta.user_id);
      
      const user = await userSchema.findOne({ _id: flutter.meta.user_id });
      if (user) {
         user.billingStatus = constants.PAYMENT_STATUS.SUCCESS;
         user.subscribed = true;
         await user.save();
         return {
           status: "Success",
           msg: "Payment Successful.",
         };
      }
      throwError("user with id provided not found in our db.");
    }
    throwError("Payment Failed");
  }
}

export default User;
