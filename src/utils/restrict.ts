import { throwError } from "./handleErrors.js";

async function restrictUser(isActive: any) {
    if (!isActive) {
        throwError("You can not perform this action, your account is deactivated", 401);
    }
}

export default {restrictUser};
