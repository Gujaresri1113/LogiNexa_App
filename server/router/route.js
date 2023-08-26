import { Router } from "express";

const router = Router();

/** import all controllers */
import * as controller from '../controllers/appController.js';
import {registerMail} from '../controllers/mailer.js';
import Auth, {localVariables} from "../middleware/auth.js";

/** POST Methods */

//register route
router.route('/register').post(controller.register);

// send the mail
router.route('/registerMail').post(registerMail);

//authenticate user
router.route('/authenticate').post((req,res) => res.end());

//login app
router.route('/login').post(controller.verifyUser,controller.login);

/**GET Methods */

//user with username
router.route('/user/:username').get(controller.getUser);

//generate random OTP
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP);

//verify generated OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP);

//reset all the variables
router.route('/createResetSession').get(controller.createResetSession);


/** PUT Methods */

//update the user
router.route('/updateuser').put(Auth, controller.updateUser);

//reset the password
router.route('/resetpassword').put(controller.verifyUser, controller.resetpassword);



export default router; 