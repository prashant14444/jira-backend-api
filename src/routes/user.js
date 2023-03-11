import express from "express";
import {AllUsers, CreateUser, GetUserById, DeleteUserById} from '../controller/user.js';

//import middlewares
import verifyToken from '../middleware/auth.js'

const UserRoutes = express.Router();

// Home page route.
UserRoutes.get("/user", verifyToken, AllUsers);
UserRoutes.get("/user/:id", verifyToken, GetUserById);
UserRoutes.delete("/user/:id", verifyToken, DeleteUserById);
UserRoutes.post("/user", verifyToken, CreateUser);

export default UserRoutes;