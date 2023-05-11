import express from "express";
import {AllComments, CreateComment, GetCommentById, DeleteCommentById, UpdateComment} from '../controller/comment.js';

//import middlewares
import isProjectMember from '../middleware/project_member.js';
import verifyToken from '../middleware/auth.js'

const CommentRoutes = express.Router();

// Home page route.
CommentRoutes.post("/comment", verifyToken, isProjectMember, CreateComment);
CommentRoutes.get("/comment", verifyToken, isProjectMember, AllComments);
CommentRoutes.put("/comment/:id", verifyToken, isProjectMember, UpdateComment);
CommentRoutes.get("/comment/:id", verifyToken, isProjectMember, GetCommentById);
CommentRoutes.delete("/comment/:id", verifyToken, isProjectMember, DeleteCommentById);

export default CommentRoutes;