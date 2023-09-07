import { SPRINT_STATUS_DEFAULT } from '../../constants/sprint_status.js';
import {TASK_DEFAULT_STATUS} from '../../constants/task.js';

//import all models here
import SprintModel from "../models/sprint.js";
import TaskModel from "../models/task.js";


// Display list of all Authors.
export const AllSprints = async(req, res) => {
    const sprint = await SprintModel.find().exec();
    return res.status(200).json({
        status: true,
        count: sprint.length,
        data: {
            sprint
        }
    });
};

// Display detail page for a specific sprint.
export const GetSprintById = async (req, res) => {
    try {
        const sprint = await SprintModel.find({_id: req.params.id}).populate(['tasks', 'created_by']).exec();
        return res.status(200).json({
            status: true,
            count: sprint.length,
            data: {
                sprint
            }
        });
        
    } catch (error) {
        let errors = {};
        switch (error.name) {
            case 'CastError':
                    errors[error.name] = error.message;
                break;

            default:
                break;
        }
        return res.status(400).json({
            status: false,
            errors
        });
    }
};

// Display Author create form on GET.
export const CreateSprint = async (req, res) => {
    req.body.created_by = req.projectMember.id;
    const sprint = SprintModel;
    
    const count = await sprint.findOne({project_id: req.body.project_id, status: SPRINT_STATUS_DEFAULT});
    if (count){
        return res.status(201).json({
            status: false,
            count: 0,
            error: {
                message: "Please close the previous sprint before starting the new one"
            }
        });
    }

    try {
        const tasks = await TaskModel.find({project_id: req.body.project_id, status: { $ne: TASK_DEFAULT_STATUS }}).exec();
        let taskIds = tasks.map(task => {return task.id;});
        req.body.tasks = [...taskIds];

        const sprintObj = await sprint.create(req.body);
        return res.status(201).json({
            status: true,
            count: sprintObj.length,
            data: {
                sprint: sprintObj
            }
        });

    } catch (error) {
        console.log(error);
        let errors = {};
        switch (error.name) {
            case "ValidationError":
                Object.keys(error.errors).forEach((key) => {
                    errors[key] = error.errors[key].message;
                });
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

// Display Author delete form on GET.
export const DeleteSprintById = async(req, res) => {
    try {
        console.log(req.params.id);
        const sprintObj = await SprintModel.findOne({_id: req.params.id}).exec();
        const result = await SprintModel.findOneAndRemove({_id: req.params.id}).exec();
        return res.status(200).json({
            status: true,
            count: sprintObj ? sprintObj.length : 0,
            data: {
                sprint: sprintObj ?? {}
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

export const UpdateSprint = async(req, res) => {
    
    let errors = {};
    try {
        const sprint = await SprintModel.findOneAndUpdate({_id: req.params.id}, req.body).exec();
    
        if (!sprint){
            errors['invalid_id'] = `Invalid sprint id supplied ${req.params.id}`;
        }
        const updatedSprintObj = await SprintModel.findOne({_id: req.params.id}).exec();

        return res.status(200).json({
            status: true,
            count: updatedSprintObj.length,
            data: {
                sprint: updatedSprintObj
            }
        });
    } catch (error) {
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