import {
  countUsers,
  createUser,
  forgetPassword,
  login,
  resetPassword,
  subscribeUser,
  updateUserDetails,
  userProfile,
  verifySubcription,
} from "../controllers/userController.js";
import router from "../core/routerConfig.js";
import { authenticate, verifyToken } from "../core/userAuth.js";
const userRouter = router;

userRouter.route("/user/register").post(createUser);
userRouter.route("/user/login").post(login);
userRouter.route("/user/forget-password").post(forgetPassword);
userRouter.route("/user/reset-password").post(resetPassword);
userRouter.route("/user/update-profile").patch(authenticate, updateUserDetails);
userRouter.route("/user/subscribe-user").post(authenticate, subscribeUser);
userRouter.route("/user/verify-sub").get(verifySubcription);
userRouter.route("/user/all-users").get(authenticate,countUsers);
userRouter.route("/user/:Id").get(authenticate, userProfile);

export default userRouter;
