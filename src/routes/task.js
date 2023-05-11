import express from "express";
import {AllTasks, CreateTask, GetTaskById, DeleteTaskById, UpdateTask} from '../controller/task.js';

//import middlewares
import verifyToken from '../middleware/auth.js';
import isProjectMember from '../middleware/project_member.js';

const TaskRoutes = express.Router();

// Home page route.
TaskRoutes.post("/task", verifyToken, isProjectMember, CreateTask);
TaskRoutes.get("/task", verifyToken, isProjectMember, AllTasks);
TaskRoutes.put("/task/:id", verifyToken, isProjectMember, UpdateTask);
TaskRoutes.get("/task/:id", verifyToken, isProjectMember, GetTaskById);
TaskRoutes.delete("/task/:id", verifyToken, isProjectMember, DeleteTaskById);

export default TaskRoutes;