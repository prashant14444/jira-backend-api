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

const app = express();

const corsOptions = {
	origin: `${process.env.HOST}:${process.env.PORT}`
};
app.use (cors(corsOptions));
app.use (bodyParser.json()); // parse requests of content-type - application/json
app.use (bodyParser.urlencoded({extended:true})); // parse requests of content-type - application/x-www-form-urlencoded
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