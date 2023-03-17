import express from "express";
import {AllDocuments, CreateDocument, GetDocumentById, DeleteDocumentById, UpdateDocument} from '../controller/document.js';

//import middlewares
import verifyToken from '../middleware/auth.js'
import uploadOptions from '../helper/file_upload.js';

const DocumentRoutes = express.Router();

// Home page route.
DocumentRoutes.post("/document", verifyToken, uploadOptions.array('filesQueue', 10), CreateDocument);
DocumentRoutes.get("/document", verifyToken, AllDocuments);
DocumentRoutes.put("/document/:id", verifyToken, UpdateDocument);
DocumentRoutes.get("/document/:id", verifyToken, GetDocumentById);
DocumentRoutes.delete("/document/:id", verifyToken, DeleteDocumentById);

export default DocumentRoutes;