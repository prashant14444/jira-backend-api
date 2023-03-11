import UserModel from "../models/user.js";

// Display list of all Authors.
export const AllUsers = async(req, res) => {
    const user = await UserModel.find().exec();
    return res.status(200).json({
        status: true,
        count: user.length,
        data: {
            user
        }
    });
};

// Display detail page for a specific Author.
export const GetUserById = async (req, res) => {
    try {
        const user = await UserModel.find({_id: req.params.id}).exec();
        return res.status(200).json({
            status: true,
            count: user.length,
            data: {
                user
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
export const CreateUser = async (req, res) => {
  const user = UserModel;

    try {
        const userObj = await user.create(req.body);
        return res.status(201).json({
            status: true,
            count: userObj.length,
            data: {
                user: userObj
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
export const DeleteUserById = async(req, res) => {
    try {
        const User = await UserModel.findOneAndRemove({_id: req.params.id, nonExistent: true}).exec();
        return res.status(200).json({
            status: true,
            count: User.length,
            data: {
                user:User
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