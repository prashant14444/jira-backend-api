import express from "express";
import {AllProjects, CreateProject, GetProjectById, DeleteProjectById, UpdateProject} from '../controller/project.js';

//import middlewares
import verifyToken from '../middleware/auth.js'

const ProjectRoutes = express.Router();

// Home page route.
ProjectRoutes.post("/project", verifyToken, CreateProject);
ProjectRoutes.get("/project", verifyToken, AllProjects);
ProjectRoutes.put("/project/:id", verifyToken, UpdateProject);
ProjectRoutes.get("/project/:id", verifyToken, GetProjectById);
ProjectRoutes.delete("/project/:id", verifyToken, DeleteProjectById);

export default ProjectRoutes;