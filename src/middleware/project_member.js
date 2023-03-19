import ProjectMemberModel from '../models/project_member.js';

const config = process.env;

const isProjectMember = async(req, res, next) => {
    const user = req.user;
    
    if(!(req.body.project_id || req.query.project_id)){
        return res.status(403).send({status: false, error:{message: "Please provide the project id, either in the body or in the query"}});
    }
    
    const projectMember = await ProjectMemberModel.findOne({user_id: user.id, project_id: req.body.project_id || req.query.project_id }).exec();
    if (!projectMember) {
        return res.status(403).send({status: false, error:{message: "Please become a project member before accessing the info"}});
    }
    req.projectMember = projectMember;
    return next();
};

export default isProjectMember;