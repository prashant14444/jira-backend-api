export const removeDuplicateIfExist = (taskIds) => {
    let temp = [];
    taskIds.map(taskId => {return temp[taskId] = taskId});
    taskIds = Object.keys(temp);
    return taskIds;
};

export const insertTaskIdIfNotExist = (taskIds, newTaskId) => {
    if (taskIds.indexOf(newTaskId) === -1){
        taskIds.push(newTaskId)
    }
    return  taskIds;
}