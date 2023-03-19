import express from "express";
import {AllEpics, CreateEpic, GetEpicById, DeleteEpicById, UpdateEpic} from '../controller/epic.js';

//import middlewares
import verifyToken from '../middleware/auth.js'
import isProjectMember from '../middleware/project_member.js';
import hasValidTaskIds from '../middleware/validate_task_ids.js' 

const EpicRoutes = express.Router();

// Home page route.
EpicRoutes.post("/epic", verifyToken, isProjectMember, CreateEpic);
EpicRoutes.get("/epic", verifyToken, isProjectMember, AllEpics);
EpicRoutes.put("/epic/:id", verifyToken, isProjectMember, hasValidTaskIds, UpdateEpic);
EpicRoutes.get("/epic/:id", verifyToken, isProjectMember, GetEpicById);
EpicRoutes.delete("/epic/:id", verifyToken, isProjectMember, DeleteEpicById);

export default EpicRoutes;