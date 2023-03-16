import mongoose from 'mongoose';
import {STATUS, TYPES, PRIORITY} from '../../utils/task.js';

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  message: {
    type: String,
    max: 500,
    required: [true]
  },
  commented_by: {
    type: mongoose.Schema.Types.ObjectId,
  },
  task_id: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    validate: {
      validator: async function(task_id) {
        const isExist = await this.model('Task').count({ _id: task_id }).exec();
        return isExist;
      },
      message: props => `"${props.value}" Invalid task ID. Task doesn't exist by this ID`
    },
  },
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