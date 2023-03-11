import UserModel from "../models/user.js";
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv'
import jwt from 'jsonwebtoken';

dotenv.config(); // loading all the .env variables

// Display list of all Authors.
export const login = async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!(email && password)) {
        res.status(400).json({
            status: false,
            error: {
                message: "Email and password is required"
            }
        });
    }

    const user = await UserModel.findOne({email}).select('+password').exec();
    if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, {expiresIn: "24h"});

        let userObject = user.toObject();
        delete userObject.password;
        userObject.token = token;

        return res.status(200).json({
            status: true,
            count: user.length,
            data: {
                user: userObject
            }
        });
    } else {
        return res.status(400).json({
            status: false,
            error: {
                message: "Invalid email or password"
            }
        });
    }
    
};
