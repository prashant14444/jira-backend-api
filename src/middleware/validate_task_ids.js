import TaskModel from '../models/task.js';

import {removeDuplicateIfExist} from '../controller_helper/task.js';

const hasValidTaskIds = async(req, res, next) => {
    let taskIds = removeDuplicateIfExist(req.body.tasks);
    req.body.tasks = taskIds;

    if (!taskIds)
        return next()

    else if(taskIds && taskIds.length == 0) {
        return res.status(403).send({status: false, error:{message: "no task Id provided"}});
    }
    else{
        try {
            const tasks = await TaskModel.find({
                '_id': { $in: taskIds}
            });
            
            console.log((tasks.length, taskIds.length, tasks.length != taskIds.length));

            if (tasks.length != taskIds.length){
                let validTaskIds = []
                tasks.map(task => { return validTaskIds.push(task.id)})

                let invalidTaskIds = [];
                taskIds.forEach(taskId => {
                    if (!(validTaskIds.includes(taskId)))
                        invalidTaskIds.push(taskId);
                });
                console.log(invalidTaskIds);
                return res.status(401).send({status: false, error:{message:`Invalid Taskids supplied: ${invalidTaskIds.join(',')}`}});
            }
        } catch (err) {
            return res.status(401).send({status: false, error:{message:err.message}});
        }
    }
    return next();
};

export default hasValidTaskIds;