import mongoose from 'mongoose';
import {STATUS, TYPES, PRIORITY, TASK_DEFAULT_STATUS} from '../../utils/task.js';

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: {
    type: String,
    max: 70,
    required: [true]
  },
  description: {
    type: String,
  },
  project_id: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    validate: {
      validator: async function(project_id) {
        const isExist = await this.model('Project').count({ _id: project_id }).exec();
        return isExist;
      },
      message: props => `"${props.value}" Invalid project ID. Project doesn't exist by this ID`
    },
  },
  priority: {
    type: String,
    ref: 'User',
    default: null,
    enum: [...PRIORITY]
  },
  type: {
    type: String,
    ref: 'User',
    default: null,
    enum: [...TYPES]
  },
  status: {
    type: String,
    ref: 'User',
    default: TASK_DEFAULT_STATUS,
    enum: [...STATUS]
  },
  due_date: {
    type: Date,
    default: null
  },
  epic_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    // validate: {
    //   validator: async function(project_id) {
    //     const isExist = await this.model('Project').count({ _id: project_id }).exec();
    //     return isExist;
    //   },
    //   message: props => `"${props.value}" Invalid project ID. Project doesn't exist by this ID`
    // },
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true],
    ref: 'ProjectMember',
    validate: {
      validator: async function(created_by) {
        const isExist = await this.model('ProjectMember').count({ _id: created_by }).exec();
        return isExist;
      },
      message: props => `"${props.value}" Invalid projectMember ID. ProjectMember doesn't exist by this ID`
    },
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectMember',
    required:[false],
    default: null,
    validate: {
      validator: async function(assigned_to) {
        const isExist = await this.model('ProjectMember').count({ _id: assigned_to }).exec();
        return isExist || !assigned_to;
      },
      message: props => `"${props.value}" Invalid projectMember ID. ProjectMember doesn't exist by this ID`
    },
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  documents:[{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  timestamps: {
    createdAt: 'created_at', // Use `created_at` to store the created date
    updatedAt: 'updated_at', // and `updated_at` to store the last updated date,
    type: Date,
    default: Date.now(0)
  }
});


TaskSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

TaskSchema.set('toJSON', {
  virtuals: true,
});


const TaskModel = mongoose.model('Task', TaskSchema);
export default TaskModel