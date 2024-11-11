import mongoose from "mongoose";
import validator from "validator";
import constants from "../utils/constants.js"
import { genSalt, hash, compare } from "bcrypt";
import { throwError } from "../utils/handleErrors.js";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  gender?: string;
  isGoogleSigned: boolean;
  bio?: string;
  role: string;
  isVerified?: boolean;
  status: string;
  validId?: string;
  cacDocument?: string;
  otp?: number;
  subscribed: boolean;
  billingStatus?: string;
  nextBillDate?: string;
}

interface UserModel extends mongoose.Model<IUser> {
  findByCredentials(loginId: string, password: string): any;
}

const Schema = new mongoose.Schema<IUser, UserModel>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value: string) {
        if (!validator.default.isEmail(value)) {
          throw new Error("Invalid Email!");
        }
        return validator.default.isEmail(value);
      },
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.keys(constants.USER_TYPE),
      required: true,
    },
    gender: {
      type: String,
      enum: Object.keys(constants.GENDER),
    },
    isGoogleSigned: {
      type: Boolean,
      required: true,
      deafult: false,
    },
    bio: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: Object.keys(constants.STATUS),
      default: constants.STATUS.ACTIVE,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    validId: {
      type: String,
      default: "",
    },
    cacDocument: {
      type: String,
      default: "",
    },
    otp: {
      type: Number,
    },
    subscribed: {
      type: Boolean,
      default: false,
    },
    billingStatus: {
      type: String,
      enum: Object.keys(constants.PAYMENT_STATUS)
    }
  },
  { timestamps: true }
);

Schema.pre('save', async function(next) {
  const salt = await genSalt(10)
 const hashPass = await hash(this.password, salt)
  this.password = hashPass
  return next()
})


Schema.static("findByCredentials",  async function findByCredentials(loginId: string, password: string) {
  const user = await UserSchema.findOne({
    $or: [{ phoneNumber: loginId }, { email: loginId }],
  }).orFail(() => Error("Invalid Login Details"));
  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    throwError("Incorrect Password");
  }
  return user;
});

const UserSchema = mongoose.model<IUser, UserModel>('user', Schema);
export default UserSchema
export {IUser}