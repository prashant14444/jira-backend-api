import ProjectMemberModel from "../models/project_member.js";

// Display list of all Project Members.
export const AllProjectMembers = async(req, res) => {
    try {
        const projectMember = await ProjectMemberModel.find({project_id: req.query.projectId}).populate(['created_by', 'project_id', 'user_id']).exec();
        return res.status(200).json({
            status: true,
            count: projectMember.length,
            data: {
                projectMember
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

// Display detail page for a specific Project Member.
export const GetProjectMemberById = async (req, res) => {
    try {
        const projectMember = await ProjectMemberModel.find({_id: req.params.id}).exec();
        return res.status(200).json({
            status: true,
            count: projectMember.length,
            data: {
                projectMember
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

// Display Project Member create form on GET.
export const CreateProjectMember = async (req, res) => {
  const projectMember = ProjectMemberModel;
    req.body.created_by = req.user.id;
    try {
        const count = await  projectMember.find({project_id: req.body.project_id, user_id: req.body.user_id}).count().exec();
        if (count){
            return res.status(400).json({
                status: false,
                error: {
                    message: "Project Member already exist"
                }
            });
        }
        
        let projectMemberObj = await projectMember.create(req.body);
        projectMemberObj = await projectMember.findById(projectMemberObj._id).populate(['created_by', 'project_id', 'user_id']).exec();
        return res.status(201).json({
            status: true,
            count: projectMemberObj.length,
            data: {
                projectMember: projectMemberObj
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

// Display Project Member delete form on GET.
export const DeleteProjectMemberById = async(req, res) => {
    try {
        console.log(req.params.id);
        const projectMemberObj = await ProjectMemberModel.findOne({_id: req.params.id}).exec();
        const result = await ProjectMemberModel.findOneAndRemove({_id: req.params.id}).exec();
        return res.status(200).json({
            status: true,
            count: projectMemberObj ? projectMemberObj.length : 0,
            data: {
                projectMember: projectMemberObj ?? {}
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

export const UpdateProjectMember = async(req, res) => {
    
    let errors = {};
    try {
        const projectMember = await ProjectMemberModel.findOneAndUpdate({_id: req.params.id}, req.body).exec();
    
        if (!projectMember){
            errors['invalid_id'] = `Invalid projectMember id supplied ${req.params.id}`;
        }
        const updatedProjectMemberObj = await ProjectMemberModel.findOne({_id: req.params.id}).exec();

        return res.status(200).json({
            status: true,
            count: updatedProjectMemberObj.length,
            data: {
                projectMember: updatedProjectMemberObj
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