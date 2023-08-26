/** validate username */

import toast from "react-hot-toast";
import { authenticate } from './helper.js';

/** validate login page username */
export async function usernameValidate(values) {
    const errors = usernameVerify({}, values);

    if (values.username) {
        // check user exist
        const { status } = await authenticate(values.username);

        if (status !== 200) {
            errors.exist = toast.error('User does not exist.. !')
        }
    }
    return errors;
}

/** validate password login page */
export async function passwordValidate(values) {
    const errors = passwordVerify({}, values);

    return errors;
}

/**validate password */
function passwordVerify(errors = {}, values) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (!values.password) {
        errors.password = toast.error('Hey..! Password Cant be empty');
    } else if (values.password.includes(" ")) {
        errors.password = toast.error('Password Not Correct..!');
    } else if (values.password.length < 4) {
        errors.password = toast.error("Password must be more than 4 characters ");
    } else if (!specialChars.test(values.password)) {
        errors.password = toast.error("Password must have special Characters, 1 Alphabet, 1 Special character and numeric values..!");
    }

    return errors;
}

function usernameVerify(error = {}, values) {
    if (!values.username) {
        error.username = toast.error('Username Required..!');
    } else if (values.username.includes(" ")) {
        error.username = toast.error('Invalid User...!')
    }

    return error;
}

/** validate Reset Password */
export async function resetPasswordValidate(values) {
    const errors = passwordVerify({}, values);

    if (values.password !== values.confirm_pwd) {
        errors.exist = toast.error("Password Not Matched..!");
    }

    return errors;
}

/** validate register form */
export async function registerValidation(values) {
    const errors = usernameVerify({}, values);
    passwordVerify(errors, values);
    emailVerify(errors, values);

    return errors;
}

/**validate email */
function emailVerify(error = {}, values) {
    if (!values.email) {
        error.email = toast.error("Email Required..!");
    } else if (values.email.includes(" ")) {
        error.email = toast.error("Enter Correct email..!");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        error.email = toast.error("Please enter Valid email Address.. !")
    }

    return error;
}

/** validate profile page */
export async function profileValidation(values) {
    const errors = emailVerify({}, values);
    return errors;
}

