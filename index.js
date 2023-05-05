import express from 'express';
import * as dotenv from 'dotenv'
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from "mongoose";

import {CONNECTION_STRING} from './config/db.config.js';
import errorHandler from './src/helper/error_handler.js';

//import routes here
import UserRoutes from './src/routes/user.js';
import AuthRoutes from './src/routes/auth.js';
import ProjectRoutes from './src/routes/project.js';
import ProjectMemberRoutes from './src/routes/project_member.js';
import TaskRoutes from './src/routes/task.js';
import CommentRoutes from './src/routes/comment.js';
import DocumentRoutes from './src/routes/document.js';
import SprintRoutes from './src/routes/sprint.js';
import EpicRoutes from './src/routes/epic.js';

const app = express();

app.use(cors());
const corsOptions = {
	origin: true,
	credentials: true
}
app.options('*', cors(corsOptions)); // preflight OPTIONS; put before other routes

app.use (bodyParser.json({limit: '50mb'})); // parse requests of content-type - application/json
app.use (bodyParser.urlencoded({extended:true, limit: '50mb'})); // parse requests of content-type - application/x-www-form-urlencoded
console.log(errorHandler);
app.use(errorHandler);


app.use(express.static('public'));// make the public foilders files available publicly

app.use('/api/v1', UserRoutes);
app.use('/api/v1', AuthRoutes);
app.use('/api/v1', ProjectRoutes);
app.use('/api/v1', ProjectMemberRoutes);
app.use('/api/v1', TaskRoutes);
app.use('/api/v1', CommentRoutes);
app.use('/api/v1', DocumentRoutes);
app.use('/api/v1', SprintRoutes);
app.use('/api/v1', EpicRoutes);


dotenv.config(); // loading all the .env variables

mongoose.set('strictQuery', false);
app.listen(process.env.PORT, async () => {
	const mongoDB = CONNECTION_STRING;
	await mongoose.connect(mongoDB);
	if (mongoose.connection.readyState){
		console.log(`mongo db connected successfully => ${mongoDB}`);
	}
    
	console.info(`app started listening on the port ${process.env.PORT}`);
    console.info(`server is running at ${process.env.HOST}:${process.env.PORT}`);
});

export default app;