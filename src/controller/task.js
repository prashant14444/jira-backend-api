import { TASK_STATUS_BACKLOG } from "../../utils/task.js";

//import all models here
import TaskModel from "../models/task.js";
import SprintModel from "../models/sprint.js";

//import helper functions
import {removeDuplicateIfExist, insertTaskIdIfNotExist} from '../controller_helper/task.js';

// Display list of all Tasks that belong to a project.
export const AllTasks = async(req, res) => {
    const task = await TaskModel.find({project_id: req.query.project_id}).exec();

    return res.status(200).json({
        status: true,
        count: task.length,
        data: {
            task
        }
    });
};

// Display detail page for a specific Task.
export const GetTaskById = async (req, res) => {
    try {
        const task = await TaskModel.find({_id: req.params.id, project_id: req.query.project_id}).populate(['comments', 'documents']).exec();
        return res.status(200).json({
            status: true,
            count: task.length,
            data: {
                task
            }
        });
    } catch (error) {
        let errors = {};
        switch (error.name) {
            case 'CastError':
                    errors[error.name] = error.message;
                    break;
                    
            default:
                errors[error.name] = error.message;
                break;
        }
        return res.status(400).json({
            status: false,
            errors
        });
    }
};

// Display Task create form on GET.
export const CreateTask = async (req, res) => {
  const task = TaskModel;
    req.body.created_by = req.projectMember.id;
    delete req.body.comments;

    try {
        const taskObj = await TaskModel.create(req.body);

        // remove or add the task from the sprint also based on the current status of the task
        let sprint = await SprintModel.findOne({project_id: taskObj.project_id}).exec();

        if(sprint){
            if (taskObj.status != TASK_STATUS_BACKLOG){
                sprint.tasks = insertTaskIdIfNotExist(sprint.tasks || [], taskObj.id);
            } else {
                sprint.tasks = sprint.tasks.filter(taskId => { return taskId != taskObj.id});
            }
            sprint.tasks = removeDuplicateIfExist(sprint.tasks);
            sprint.save();
        }

        return res.status(201).json({
            status: true,
            count: taskObj.length,
            data: {
                task: taskObj
            }
        });

    } catch (error) {
        let errors = {};
        if (error.name === "ValidationError") {    
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
        }
        else if (error.name === "MongoServerError") {
            errors[error.name] = error.message;
        }
        return res.status(400).json({
            status: false,
            errors
        });
    }
};

// Display Task delete form on GET.
export const DeleteTaskById = async(req, res) => {
    try {
        const taskObj = await TaskModel.findOne({_id: req.params.id}).exec();
        const result = await TaskModel.findOneAndRemove({_id: req.params.id}).exec();

        // remove the task from the sprint also
        if (taskObj){
            let sprint = await SprintModel.findOne({project_id: taskObj.project_id}).exec();
            if (sprint){
                sprint.tasks = sprint.tasks.filter(taskId => { return taskId != taskObj._id.toString()});
                sprint.tasks = removeDuplicateIfExist(sprint.tasks);
                sprint.save();
            }
        }
        return res.status(200).json({
            status: true,
            count: taskObj ? taskObj.length : 0,
            data: {
                task: taskObj ?? {}
            }
        });
        
    } catch (error) {
        let errors = {};
        switch (error.name) {
            case 'CastError':
                errors[error.name] = error.message;
                break;
            
            case 'TypeError':
                errors[error.name] = error.message;
                break;
                
            default:
                errors[error.name] = error.message;
                break;
        }
        return res.status(400).json({
            status: false,
            errors
        });
    }
};

export const UpdateTask = async(req, res) => {
    delete req.body.project_id; //removed the project id as it can't be updated 
    
    let errors = {};
    try {
        const taskExist = await TaskModel.findOneAndUpdate({_id: req.params.id}, req.body, {runValidators:true}).exec();
    
        if (!taskExist){
            errors['invalid_id'] = `Invalid task id supplied ${req.params.id}`;
        }
        const task = await TaskModel.findOne({_id: req.params.id}).exec();

        // remove or add the task from the sprint also based on the current status of the task
        let sprint = await SprintModel.findOne({project_id: task.project_id}).exec();
        if (sprint) {
            if (task.status != TASK_STATUS_BACKLOG){
                sprint.tasks = insertTaskIdIfNotExist(sprint.tasks || [], task.id);
            } else {
                sprint.tasks = sprint.tasks.filter(taskId => { return taskId != task._id.toString()});
            }
            sprint.tasks = removeDuplicateIfExist(sprint.tasks);
            sprint.save();
        }

        return res.status(200).json({
            status: true,
            count: task.length,
            data: {
                task
            }
        });
    } catch (error) {
        console.log(error);
        switch (error.name) {
            case 'CastError':
                errors[error.name] = error.message;
                break;
            
            case 'TypeError':
                errors[error.name] = error.message;
                break;
                
            default:
                errors[error.name] = error.message;
                break;
        }
        return res.status(400).json({
            status: false,
            errors
        });
    }
}