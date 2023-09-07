import mongoose from 'mongoose';
import {STATUS, TYPES, PRIORITY} from '../../constants/task.js';

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  message: {
    type: String,
    max: 500,
    required: [true]
  },
  commented_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectMember",
    validate: {
      validator: async function(commented_by) {
        const isExist = await this.model('ProjectMember').count({ _id: commented_by }).exec();
        return isExist;
      },
      message: props => `"${props.value}" Invalid Project Member ID. Projet Member doesn't exist by this ID`
    },
  },
  task_id: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
    validate: {
      validator: async function(task_id) {
        const isExist = await this.model('Task').count({ _id: task_id }).exec();
        return isExist;
      },
      message: props => `"${props.value}" Invalid task ID. Task doesn't exist by this ID`
    },
  },
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


CommentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

CommentSchema.set('toJSON', {
  virtuals: true,
});


const CommentModel = mongoose.model('Comment', CommentSchema);
export default CommentModel