import ProjectModel from "../models/project.js";

// Display list of all Authors.
export const AllProjects = async(req, res) => {
    const project = await ProjectModel.find().populate('created_by').exec();
    return res.status(200).json({
        status: true,
        count: project.length,
        data: {
            project
        }
    });
};

// Display detail page for a specific Author.
export const GetProjectById = async (req, res) => {
    try {
        const project = await ProjectModel.find({_id: req.params.id}).exec();
        return res.status(200).json({
            status: true,
            count: project.length,
            data: {
                project
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
export const CreateProject = async (req, res) => {
  const project = ProjectModel;

    try {
        const projectObj = await project.create(req.body);
        return res.status(201).json({
            status: true,
            count: projectObj.length,
            data: {
                project: projectObj
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
export const DeleteProjectById = async(req, res) => {
    try {
        const project = await ProjectModel.findOneAndRemove({_id: req.params.id, nonExistent: true}).exec();
        return res.status(200).json({
            status: true,
            count: project.length,
            data: {
                project
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
                break;
        }
        return res.status(400).json({
            status: false,
            errors
        });
    }
};

export const UpdateProject = async(req, res) => {
    const project = await ProjectModel.findOneAndUpdate({_id: req.params.id}, req.body).exec();
    let errors = {};

    if (!project){
        errors['invalid_id'] = `Invalid project id supplied ${req.params.id}`;
    }

    try {
        const updatedProjectObj = await ProjectModel.findOne({_id: req.params.id}).exec();

        return res.status(200).json({
            status: true,
            count: updatedProjectObj.length,
            data: {
                project: updatedProjectObj
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
                break;
        }
        return res.status(400).json({
            status: false,
            errors
        });
    }
}