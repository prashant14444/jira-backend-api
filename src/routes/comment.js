import express from "express";
import {AllComments, CreateComment, GetCommentById, DeleteCommentById, UpdateComment} from '../controller/comment.js';

//import middlewares
import verifyToken from '../middleware/auth.js'

const CommentRoutes = express.Router();

// Home page route.
CommentRoutes.post("/comment", verifyToken, CreateComment);
CommentRoutes.get("/comment", verifyToken, AllComments);
CommentRoutes.put("/comment/:id", verifyToken, UpdateComment);
CommentRoutes.get("/comment/:id", verifyToken, GetCommentById);
CommentRoutes.delete("/comment/:id", verifyToken, DeleteCommentById);

export default CommentRoutes;