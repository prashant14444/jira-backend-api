import EpicModel from "../models/epic.js";

import { removeDuplicateIfExist } from "../controller_helper/task.js";

// Display list of all Epics.
export const AllEpics = async(req, res) => {
    const epic = await EpicModel.find().populate('created_by').exec();
    return res.status(200).json({
        status: true,
        count: epic.length,
        data: {
            epic
        }
    });
};

// Display detail page for a specific Author.
export const GetEpicById = async (req, res) => {
    try {
        const epic = await EpicModel.find({_id: req.params.id}).populate(['tasks', 'created_by']).exec();
        return res.status(200).json({
            status: true,
            count: epic.length,
            data: {
                epic
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
export const CreateEpic = async (req, res) => {
    const epic = EpicModel;
    req.body.created_by = req.projectMember.id;

    try {
        const epicObj = await epic.create(req.body);
        return res.status(201).json({
            status: true,
            count: epicObj.length,
            data: {
                epic: epicObj
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

// Display Author delete form on GET.
export const DeleteEpicById = async(req, res) => {
    try {
        const epicObj = await EpicModel.findOne({_id: req.params.id}).exec();
        const result = await EpicModel.findOneAndRemove({_id: req.params.id}).exec();
        return res.status(200).json({
            status: true,
            count: epicObj ? epicObj.length : 0,
            data: {
                epic: epicObj ?? {}
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

export const UpdateEpic = async(req, res) => {
    
    let errors = {};
    try {
        const epicObj = await EpicModel.findById(req.params.id).exec();
        let tasks = epicObj.tasks || [];
        let mergedTasks = removeDuplicateIfExist([...tasks, ...req.body.tasks]);
        req.body.tasks = mergedTasks;

        const epic = await EpicModel.findOneAndUpdate({_id: req.params.id}, req.body).exec();
    
        if (!epic){
            errors['invalid_id'] = `Invalid epic id supplied ${req.params.id}`;
        }
        const updatedEpicObj = await EpicModel.findOne({_id: req.params.id}).exec();

        return res.status(200).json({
            status: true,
            count: updatedEpicObj.length,
            data: {
                epic: updatedEpicObj
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