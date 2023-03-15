import express from "express";
import {AllTasks, CreateTask, GetTaskById, DeleteTaskById, UpdateTask} from '../controller/task.js';

//import middlewares
import verifyToken from '../middleware/auth.js'

const TaskRoutes = express.Router();

// Home page route.
TaskRoutes.post("/task", verifyToken, CreateTask);
TaskRoutes.get("/task", verifyToken, AllTasks);
TaskRoutes.put("/task/:id", verifyToken, UpdateTask);
TaskRoutes.get("/task/:id", verifyToken, GetTaskById);
TaskRoutes.delete("/task/:id", verifyToken, DeleteTaskById);

export default TaskRoutes;