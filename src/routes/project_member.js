import express from "express";
import {AllProjectMembers, CreateProjectMember, GetProjectMemberById, DeleteProjectMemberById, UpdateProjectMember} from '../controller/project_member.js';

//import middlewares
import verifyToken from '../middleware/auth.js'

const ProjectMemberRoutes = express.Router();

// Home page route.
ProjectMemberRoutes.post("/project-member", verifyToken, CreateProjectMember);
ProjectMemberRoutes.get("/project-member", verifyToken, AllProjectMembers);
ProjectMemberRoutes.put("/project-member/:id", verifyToken, UpdateProjectMember);
ProjectMemberRoutes.get("/project-member/:id", verifyToken, GetProjectMemberById);
ProjectMemberRoutes.delete("/project-member/:id", verifyToken, DeleteProjectMemberById);

export default ProjectMemberRoutes;