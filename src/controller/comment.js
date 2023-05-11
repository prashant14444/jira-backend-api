import CommentModel from "../models/comment.js";
import TaskModel from "../models/task.js";

// Display list of all Project Members.
export const AllComments = async(req, res) => {
    const task_id = req.query.task_id;

    const comment = await CommentModel.find({task_id}).populate({
        path : 'commented_by',
        populate : {
            path : 'user_id'
        }
    }).exec();
    return res.status(200).json({
        status: true,
        count: comment.length,
        data: {
            comment
        }
    });
};

// Display detail page for a specific Project Member.
export const GetCommentById = async (req, res) => {
    try {
        const comment = await CommentModel.find({_id: req.params.id}).populate(['documents']).exec();
        return res.status(200).json({
            status: true,
            count: comment.length,
            data: {
                comment
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
export const CreateComment = async (req, res) => {
    req.body.commented_by = req.projectMember.id;

    try {
        const commentObj = await CommentModel.create(req.body);
        
        //find the task and add the reference to this comment to the task
        let task = await TaskModel.findById(req.body.task_id).exec();
        task.comments.push(commentObj._id);
        task.save();

        const comment = await CommentModel.findById(commentObj._id).populate({
            path : 'commented_by',
            populate : {
                path : 'user_id'
            }
        }).exec();
        return res.status(201).json({
            status: true,
            count: comment.length,
            data: {
                comment
            }
        });

    } catch (error) {
        console.log(error);
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
export const DeleteCommentById = async(req, res) => {
    try {
        const commentObj = await CommentModel.findById(req.params.id).exec();
        console.log("commentObj", commentObj);
        const result = await CommentModel.findByIdAndRemove(req.params.id).exec();
        
        //find the task and add the reference to this comment to the task
        if (commentObj){
            let task = await TaskModel.findById(commentObj.task_id).exec();
            let updatedComments = task.comments.filter(function(item) { 
                return item != commentObj._id.toString();
            });
            task.comments = updatedComments;
            task.save();
        }
            
        return res.status(200).json({
            status: true,
            count: commentObj ? commentObj.length : 0,
            data: {
                comment: commentObj ?? {}
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

export const UpdateComment = async(req, res) => {
    
    let errors = {};
    try {
        const comment = await CommentModel.findOneAndUpdate({_id: req.params.id}, req.body).exec();
    
        if (!comment){
            errors['invalid_id'] = `Invalid comment id supplied ${req.params.id}`;
        }
        const updatedCommentObj = await CommentModel.findOne({_id: req.params.id}).exec();

        return res.status(200).json({
            status: true,
            count: updatedCommentObj.length,
            data: {
                comment: updatedCommentObj
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