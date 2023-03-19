import mongoose from 'mongoose';
import { SPRINT_STATUS_DEFAULT, SPRINT_STATUS } from '../../utils/sprint_status.js';

const Schema = mongoose.Schema;

const SprintSchema = new Schema({
  title: {
    type: String,
    max: 70,
    required: [true],
    unique: true,
    validate: {
        validator: async function(name) {
            const count = await this.model('Sprint').count({ name }).exec();
            return !count;
        },
        message: props => `"${props.value}" name is Already in use, please use different name`
    },
  },
  goal: {
    type: String,
    required: [true]
  },
  start_date: { 
    type: Date,
    default: null
  },
  end_date: { 
    type: Date,
    default: null
  },
  status: {
    type: String,
    required: [true],
    default: SPRINT_STATUS_DEFAULT, 
    enum: [...SPRINT_STATUS]
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true]
  },
  tasks:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    index: {
      unique: true,
      dropDups: true
    }
  }],
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectMember',
    required: [true],
    validate: {
        validator: async function(created_by) {
            const count = await this.model('ProjectMember').count({ _id: created_by }).exec();
            return count;
        },
        message: props => `"${props.value}" Invalid created by ID. ProjectMember doesn't exist by this ID.`
    },
  },
  timestamps: {
    createdAt: 'created_at', // Use `created_at` to store the created date
    updatedAt: 'updated_at', // and `updated_at` to store the last updated date,
    type: Date,
    default: Date.now(0)
  }
});


SprintSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

SprintSchema.set('toJSON', {
  virtuals: true,
});

const SprintModel = mongoose.model('Sprint', SprintSchema);
export default SprintModel