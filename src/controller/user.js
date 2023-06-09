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
    console.log(req.params.id);

    try {
        const userObj = await UserModel.findById(req.params.id);

        if(!userObj){
            return res.status(404).json({
                status: false,
                count: 0,
                error: {
                    message:"User not found, Please refresh the page"
                }
            });
        }
        const User = await UserModel.findOneAndRemove({_id: req.params.id}).exec();
        console.log(User);
        return res.status(200).json({
            status: true,
            count: userObj.length,
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
                errors[error.name] = error.message;
                break;
        }
        return res.status(400).json({
            status: false,
            errors
        });
    }
};

export const UpdateUser = async(req, res) => {
    
    let errors = {};
    try {
        const user = await UserModel.findOneAndUpdate({_id: req.params.id}, req.body).exec();
    
        if (!user){
            errors['invalid_id'] = `Invalid user id supplied ${req.params.id}`;
        }
        const updatedUserObj = await UserModel.findOne({_id: req.params.id}).exec();

        return res.status(200).json({
            status: true,
            count: updatedUserObj.length,
            data: {
                user: updatedUserObj
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