import * as dotenv from 'dotenv'
import mongoose from 'mongoose';
import {DOCUMENT_COLLECTION_NAMES} from '../../utils/document_collection_names.js';

dotenv.config(); // loading all the .env variables

const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
  name: {
    type: String,
    max: 40,
    required: [true]
  },
  name_on_filesystem: {
    type: String,
    max: 40,
    required: [true]
  },
  type: {
    type: String,
  },
  task_id: { 
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    default: null,
    validate: {
      validator: async function(task_id) {
        const isExist = await this.model('Task').count({ _id: task_id }).exec();
        return isExist || !task_id;
      },
      message: props => `"${props.value}" Invalid task ID. Task doesn't exist by this ID`
    },
  },
  project_member_id: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    validate: {
      validator: async function(project_member_id) {
        const isExist = await this.model('ProjectMember').count({ _id: project_member_id }).exec();
        return isExist;
      },
      message: props => `"${props.value}" Invalid project member ID. Project Member doesn't exist by this ID`
    },
  },
  comment_id: { 
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    default: null,
    validate: {
      validator: async function(comment_id) {
        const isExist = await this.model('Comment').count({ _id: comment_id }).exec();
        return isExist || !comment_id;
      },
      message: props => `"${props.value}" Invalid comment ID. Comment doesn't exist by this ID`
    },
  },
  project_id: { 
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    default: null,
    validate: {
      validator: async function(project_id) {
        const isExist = await this.model('Project').count({ _id: project_id }).exec();
        return isExist || !project_id;
      },
      message: props => `"${props.value}" Invalid project ID. Project doesn't exist by this ID`
    },
  },
  collection_name: {
    type: String,
    required: true,
    enum: [...DOCUMENT_COLLECTION_NAMES]
  },
  timestamps: {
    createdAt: 'created_at', // Use `created_at` to store the created date
    updatedAt: 'updated_at', // and `updated_at` to store the last updated date,
    type: Date,
    default: Date.now(0)
  }
});


DocumentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});


DocumentSchema.virtual('documentPath').get(function () {
  const path = `${process.env.HOST}:${process.env.PORT}/${process.env.DOCUMENT_UPLOADS_PATH}/${this.name_on_filesystem}`.replace('public/', '')
  return path;
});



DocumentSchema.set('toJSON', {
  virtuals: true,
});


const DocumentModel = mongoose.model('Document', DocumentSchema);
export default DocumentModel