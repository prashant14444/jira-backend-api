import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv'

dotenv.config(); // loading all the .env variables
const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({status: false, error:{message: "A token is required for authentication"}});
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({status: false, error:{message:"Invalid Token"}});
  }
  return next();
};

export default verifyToken;