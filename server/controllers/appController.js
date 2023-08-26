import jwt from "jsonwebtoken";
import UserModel from "../model/User.model.js";
import bcrypt from 'bcrypt';
import ENV from '../config.js';
import otpGenerator from 'otp-generator';


/** middleware for verify user */
export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method == "GET" ? req.query : req.body;

        //check the user existence
        let exist = await UserModel.findOne({ username });
        if (!exist) return res.status(404).send({ error: "Cant't find User. !" });
        next();
    } catch (error) {
        return res.status(404).send({ error: "Authentication Error...!" })
    }
}

/** POST : http://localhost:8080/api/register
* @param : {
    "username" : "sri123",
    "password" : "sri@123",
    "email" : "sri@gmail.com",
    "firstName" : "sri",
    "lastName" : "gujare",
    "mobile" : 9876451290,
    "address" : "At.246, Pune",
    "profile" : ""
}
*/
export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;

        // check the existing user
        const existUsername = new Promise((resolve, reject) => {
            UserModel.findOne({ username }, function (err, user) {
                if (err) reject(new Error(err))
                if (user) reject({ error: "Please use unique username" });

                resolve();
            })
        });

        // check for existing email
        const existEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email }, function (err, email) {
                if (err) reject(new Error(err))
                if (email) reject({ error: "Please use unique Email" });

                resolve();
            })
        });


        Promise.all([existUsername, existEmail])
            .then(() => {
                if (password) {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {

                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                profile: profile || '',
                                email
                            });

                            // return save result as a response
                            user.save()
                                .then(result => res.status(201).send({ msg: "User Register Successfully" }))
                                .catch(error => res.status(500).send({ error }))

                        }).catch(error => {
                            return res.status(500).send({
                                error: "Enable to hashed password"
                            })
                        })
                }
            }).catch(error => {
                return res.status(500).send({ error })
            })


    } catch (error) {
        return res.status(500).send({ error: "madhye nhai ala" });
    }

};

/** POST : http://localhost:8080/api/login
 * @param: {
     "username" : "sri123",
     "password" : "sri@123"
  }
 */
export async function login(req, res) {
    const { username, password } = req.body;

    try {
        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {
                        if (!passwordCheck) return res.status(400).send({ error: " Don't have Password" });

                        //create jwt token
                        const token = jwt.sign({
                            userId: user._id,
                            username: user.username,
                        }, ENV.JWT_SECRET, { expiresIn: "24h" });

                        return res.status(200).send({
                            msg: "Login Successful...!",
                            username: user.username,
                            token
                        });
                    })
                    .catch(error => {
                        return res.status(404).send({ error: "Password Not Match" });
                    })
            })
            .catch(error => {
                return res.status(404).send({ error: "Username Not Found" });
            })
    } catch (error) {
        return res.status(500).send({ error })
    }
};

/**GET: http://localhost:8080/api/user/sri123 */
export async function getUser(req, res) {
    const { username } = req.params;
    try {
        if (!username) return res.status(501).send({ error: "Invalid Username" });

        UserModel.findOne({ username }, function (err, user) {
            if (err) return res.status(500).send({ err });
            if (!user) return res.status(501).send({ error: "Couldn't Find The User" });

            //remove password from the user
            //mongoose return unneccessary data with object to convert it to json
            const { password, ...rest } = Object.assign({}, user.toJSON());
            return res.status(201).send(rest);

        })

    } catch (error) {
        return res.status(404).send({ error: "Cannot Find the User Data !" });
    }
}

/**PUT: http://localhost:8080/api/updateUser
 * @param : {
  "id : "<userid>"
}

body : {
    firstName:'',
    address: '',
    profile : ''
}
 */
export async function updateUser(req, res) {
    try {
        //const id = req.query.id;

        const { userId } = req.user;

        if (userId) {

            const body = req.body;

            //update the data
            UserModel.updateOne({ _id: userId }, body, function (err, data) {
                if (err) throw err;

                return res.status(201).send({ msg: "Record Updated !" });
            })
        } else {
            return res.status(401).send({ error: "User Not Found..!" });
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}

/**GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
    req.app.locals.OTP = await otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    })

    res.status(201).send({ code: req.app.locals.OTP })
}

/**GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null; // reset the otp value
        req.app.locals.resetSession = true; // start session for restepasssword
        return res.status(201).send({ msg: 'Verify Successfully.. !' })
    }
    return res.status(400).send({ error: "Invalid OTP" });
}

//redirect user when OTP is valid
/**GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        // allow access to this route only once
        return res.status(201).send({ flag :  req.app.locals.resetSession });
    }
    return res.status(440).send({ error: "Session Expired" });
}

//redirect user to reset password
/**PUT  : http://localhost:8080/api/resetpassword */
export async function resetpassword(req, res) {
    try {

        if (!req.app.locals.resetSession) return res.status(440).send({ error: "Session Expired !" });
        const { username, password } = req.body;
        try {

            UserModel.findOne({ username })
                .then(user => {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            UserModel.updateOne({ username: user.username }, { password: hashedPassword }, function (err, data) {
                                if (err) throw err;
                                req.app.locals.resetSession = false; // reset session
                                return res.status(201).send({ msg: "Record Updated !" })
                            });
                        })
                        .catch(e => {
                            return res.status(500).send({
                                error: "Enable to hashed password"
                            })
                        })
                })
                .catch(error => {
                    return res.status(404).send({ error: "username not Found " })
                })

        } catch (error) {
            return res.status(500).send({ error })
        }
    } catch (error) {
        return res.status(401).send({ error })
    }
}


