import express from "express";
import {AllSprints, CreateSprint, GetSprintById, DeleteSprintById, UpdateSprint} from '../controller/sprint.js';

//import middlewares
import verifyToken from '../middleware/auth.js'
import isProjectMember from '../middleware/project_member.js'

const SprintRoutes = express.Router();

// Sprint page route.
SprintRoutes.post("/sprint", verifyToken, isProjectMember, CreateSprint);
SprintRoutes.get("/sprint", verifyToken, isProjectMember, AllSprints);
SprintRoutes.put("/sprint/:id", verifyToken, isProjectMember, UpdateSprint);
SprintRoutes.get("/sprint/:id", verifyToken, isProjectMember, GetSprintById);
SprintRoutes.delete("/sprint/:id", verifyToken, isProjectMember, DeleteSprintById);

export default SprintRoutes;