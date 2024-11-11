import { NextFunction, Request, Response } from "express";

/*eslint-disable*/
import jwt  from "jsonwebtoken"
import UserSchema from "../models/userModel.js";
import { JWT_SECRETE_KEY, TOKEN_DURATION }  from "./config.js"
import {
  throwError,
  handleCastErrorExceptionForInvalidObjectId,
  isCastError,
}  from "../utils/handleErrors.js"
import BaseController from "../utils/baseController.js"
import constants  from "../utils/constants.js"

// Generate Authorization Token
async function generateAuthToken(payload: any) {
  return jwt.sign(
    payload,
    JWT_SECRETE_KEY,
    { expiresIn: TOKEN_DURATION }
  );
}

// checking if a user has a token
const authenticate = async (req: any, res: Response, next: NextFunction) => {
  try {
    const jwtPayload = decodeJwtToken(req);
    const user = await getUserPayload(jwtPayload);
    req.token = jwtPayload.token;

    req.user = user;
    next();
  } catch (e: any) {
    return new BaseController().error(res, { code: 401, message: e.message });
  }
};

// Decoding Jwt token
function decodeJwtToken(req: Request) {
  const requestHeaderAuthorization = req.headers.authorization ?? "";

  if (!requestHeaderAuthorization) {
    throwError("Authentication Failed. Please login", 401);
  }

  const [authBearer, token]: any = requestHeaderAuthorization.split(" ");

  if (authBearer !== "Bearer") {
    throwError("Authentication Failed", 401);
  }
  const jwtPayload: any = verifyToken(token);

  jwtPayload.token = token;
  return jwtPayload;
}

function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRETE_KEY);
}

async function getUserPayload(payload: any) {
  const userId = payload.userId;
  return getUsersPayload(userId);
}

async function getUsersPayload(userId: string) {
  return await UserSchema.findOne({ _id: userId })
    .orFail(() =>
      throwError("Access denied. Please login or create an account", 401)
    )
    .catch((error: any) =>
      isCastError(error) ? handleCastErrorExceptionForInvalidObjectId() : error
    );
}

// Permission for users
function permit(roles: string[]) {
  return (req: any, res: Response, next: NextFunction) => {
    const isAuthorized = roles.includes(req.user.role);
    if (!isAuthorized) {
      return new BaseController().error(res, {
        code: 403,
        message: "Unauthorized Access. Contact the admin.",
      });
    }

    next();
  };
}
// Permission for only superAdmin
function permitSuperAdmin(role: string[]) {
  return (req: any, res: Response, next: NextFunction) => {
    // const isAuthorized = role.includes(req.user.role);
    if (req.user.role !== constants.ADMIN_ROLES.SUPER_ADMIN) {
      return new BaseController().error(res, {
        code: 403,
        message: "Unauthorized Access. Contact the super admin.",
      });
    }

    next();
  };
}
function isAllowed(users: string[]) {
  return (req: any, res: Response, next: NextFunction) => {
    const isAuthorized = users.includes(req.user.verified);

    if (!isAuthorized) {
      return new BaseController().error(res, {
        code: 403,
        message:
          "You are not a verified user yet. Please contact the Administrator for further directives",
      });
    }

    next();
  };
}

function restrict(users: string[]) {
  return (req: any, res: Response, next: NextFunction) => {
    const isRestricted = users.includes(req.user.isActive);

    if (!isRestricted) {
      return new BaseController().error(res, {
        code: 403,
        message:
          "Sorry You Can Not Perform This Action Your Account is De-activated",
      });
    }

    next();
  };
}

export {
  authenticate,
  permit,
  permitSuperAdmin,
  generateAuthToken,
  isAllowed,
  restrict,
  verifyToken,
  decodeJwtToken,
};
