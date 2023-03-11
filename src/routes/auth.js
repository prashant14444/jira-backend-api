import express from "express";
import {login} from '../controller/auth.js';

const AuthRoutes = express.Router();

// Home page route.
AuthRoutes.post("/login", login);

export default AuthRoutes;