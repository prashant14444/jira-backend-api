import fs from 'fs';

//import all models here 
import DocumentModel from "../models/document.js";
import TaskModel from "../models/task.js";
import CommentModel from "../models/comment.js";
import ProjectMemberModel from '../models/project_member.js';
import ProjectModel from '../models/project.js';


// Display list of all Documents.
export const AllDocuments = async(req, res) => {
    const document = await DocumentModel.find().populate(['project_member_id']).exec();
    return res.status(200).json({
        status: true,
        count: document.length,
        data: {
            document
        }
    });
};

// Display detail page for a specific Document.
export const GetDocumentById = async (req, res) => {
    try {
        const document = await DocumentModel.find({_id: req.params.id}).exec();
        return res.status(200).json({
            status: true,
            count: document.length,
            data: {
                document
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

// Display Document create form on GET.
export const CreateDocument = async (req, res) => {
    const files = req.files;
    const projectMember = await ProjectMemberModel.findOne({user_id: req.user.id}).exec();
    try {
        let documentIds = [];
        let documents = [];
        
        let task_id = req.body.task_id;
        let comment_id = req.body.comment_id;
        let project_id = req.body.project_id;

        let collection_name = task_id ? 'tasks': (comment_id ? 'comments' : 'documents');
        console.log("collection_name", collection_name);

        for(let i = 0; i < files.length; i++){
            let file = files[i];
            let tempObj = {
                name: file.originalname,
                name_on_filesystem: file.filesystem_name,
                type: file.mimetype,
                project_member_id: projectMember.id,
                task_id: task_id || null,
                comment_id: comment_id || null,
                project_id: project_id || null,
                collection_name,
            }
            // console.log("tempObj=>", tempObj);
            let document = await DocumentModel.create(tempObj);
            documentIds.push(document._id);
            documents.push(document);
        }

        //if the uploaded document is for comments then add the document id in the comment's document else if it is part of the task then add it to the task's documents 
        if (comment_id){
            let comment = await CommentModel.findById(comment_id).exec();
            comment.documents.push(...documentIds);
            comment.save({ validateBeforeSave: false });
        } else if (task_id){
            let task = await TaskModel.findById(task_id).exec();
            task.documents.push(...documentIds);
            task.save({ validateBeforeSave: false });
        } else if (project_id){
            let project = await ProjectModel.findById(project_id).exec();
            project.documents.push(...documentIds);
            project.save({ validateBeforeSave: false });
        }

        return res.status(201).json({
            status: true,
            count: documents.length,
            data: {
                document: documents
            }
        });

    } catch (error) {
        console.log(error);
        let errors = {};
        switch (errors.name) {
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

// Display Document delete form on GET.
export const DeleteDocumentById = async(req, res) => {
    try {
        const document = await DocumentModel.findOne({_id: req.params.id}).exec();
        const result = await DocumentModel.findOneAndRemove({_id: req.params.id}).exec();
  
        //find the task or comment and remove the reference to this document
        if (document){
            if (document.comment_id){
                let comment = await CommentModel.findById(document.comment_id).exec();
                comment.documents = comment.documents.filter(function(item) { return item !== document._id});
                comment.save();
            } else if (document.task_id){
                let task = await TaskModel.findById(document.task_id).exec();
                task.documents = task.documents.filter(function(item) { return item !== document._id});
                task.save();
            } else if (document.project_id){
                let project = await ProjectModel.findById(document.project_id).exec();
                project.documents = project.documents.filter(function(item) { return item !== document._id});
                project.save();
            }
            
            //remove the file from the filesystem too.
            fs.unlink(`./${process.env.DOCUMENT_UPLOADS_PATH}/${document.name_on_filesystem}`, function (err) {
                if (err) throw err;
                console.log('File deleted!');
            });
        }
        
        return res.status(200).json({
            status: true,
            count: document ? document.length : 0,
            data: {
                document: document ?? {}
            }
        });
        
    } catch (error) {
        console.log(error);

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

export const UpdateDocument = async(req, res) => {
    return res.status(200).json({
        status: false,
        count: 0,
        error: {
            message: "update of the document is not supported at the moment"
        }
    });
}