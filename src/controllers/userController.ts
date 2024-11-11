import { ErrorRequestHandler, Request, Response } from "express";
import User from "../services/users.js";
import BaseController from "../utils/baseController.js";
import { logger } from "../utils/logger.js";
import { generateAuthToken } from "../core/userAuth.js";

async function createUser(req: Request, res: Response) {
  try {
    const newUser = await new User(req.body).createUser();
    const token = await generateAuthToken({
      userId: newUser._id,
      isVerified: newUser.isVerified,
      role: newUser.role,
    });
    return new BaseController().success(res, { newUser, token });
  } catch (err: any) {
    logger.error("Error Occured At createUser", err);
    return new BaseController().error(res, {
      code: err.code,
      message: err.message,
    });
  }
}

async function login(req: Request, res: Response) {
  try {
    const user = await new User(req.body).login();
    const token = await generateAuthToken({
      userId: user._id,
      isVerified: user.isVerified,
      role: user.role,
    });
    return new BaseController().success(res, { user, token });
  } catch (err: any) {
    logger.error("Error Occured At Login", err);
    return new BaseController().error(res, {
      code: err.code,
      message: err.message,
    });
  }
}
async function userProfile(req: Request, res: Response) {
  try {
    const user = await new User(req.params.Id).userProfile();
    return new BaseController().success(res, { user });
  } catch (err: any) {
    logger.error("Error Occured At userProfile", err);
    return new BaseController().error(res, {
      code: err.code,
      message: err.message,
    });
  }
}
async function updateUserDetails(req: any, res: Response) {
  try {
    const newDetails = req.body;
    const oldDetails = req.user;
    const userUpdates = await new User({
      newDetails,
      oldDetails,
    }).updateUserDetails();
    return new BaseController().success(res, { userUpdates });
  } catch (err: any) {
    logger.error("Error Occured At updateUserDetails", err);
    return new BaseController().error(res, {
      code: err.code,
      message: err.message,
    });
  }
}

async function countUsers(req: Request, res: Response) {
  try {
    const users = await new User({}).getAllUser();
    return new BaseController().success(res, {
      UserCount: users.length,
      users,
    });
  } catch (err: any) {
    logger.error("Error Occured At userProfile", err);
    return new BaseController().error(res, {
      code: err.code,
      message: err.message,
    });
  }
}

async function forgetPassword(req: Request, res: Response) {
  try {
    await new User({ email: req.body.email }).forgotPassword();
    return new BaseController().success(res, { Message: "OTP SENT!" });
  } catch (err: any) {
    logger.error("Error Occured At forgetPassword", err);
    return new BaseController().error(res, {
      code: err.code,
      message: err.message,
    });
  }
}

async function resetPassword(req: Request, res: Response) {
  try {
    await new User({
      otp: req.body.otp,
      newPassword: req.body.newPassword,
    }).resetPassword();
    return new BaseController().success(res, {
      Message: "Successfully Reset Password",
    });
  } catch (err: any) {
    logger.error("Error Occured At resetPassword", err);
    return new BaseController().error(res, {
      code: err.code,
      message: err.message,
    });
  }
}

async function subscribeUser(req: any, res: Response) {
  try {
    console.log(req.user);
    
   const sub = await new User({
      email: req.user.email,
      userId: req.user._id,
    }).subscribeUser();
    return new BaseController().success(res, {
      sub,
    });
  } catch (err: any) {
    logger.error("Error Occured At subscribeUser", err);
    return new BaseController().error(res, {
      code: err.code,
      message: err.message,
    });
  }
}

async function verifySubcription(req: any, res: Response) {
  try {
    const sub = await new User({
      // email: req.user.email,
      amount: req.query.amount,
      tx_ref: req.query.tx_ref,
      transaction_id: req.query.transaction_id,
    }).verifySubcription();
    return new BaseController().success(res, {
      sub,
    });
  } catch (err: any) {
    logger.error("Error Occured At verifySubcription", err);
    return new BaseController().error(res, {
      code: err.code,
      message: err.message,
    });
  }
}

export {
  createUser,
  login,
  updateUserDetails,
  userProfile,
  countUsers,
  forgetPassword,
  resetPassword,
  subscribeUser,
  verifySubcription
};
