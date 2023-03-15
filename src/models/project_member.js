import mongoose from 'mongoose';
import {PROJECT_MEMBERS_DESIGNATIONS} from '../../utils/project_member_designations.js'
const Schema = mongoose.Schema;

const ProjectMemberSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true],
    validate: {
        validator: async function(user_id) {
            const count = await this.model('User').count({ _id: user_id }).exec();
            return count;
        },
        message: props => `"${props.value}" Invalid User ID. User doesn't exist by this ID.`
    },
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true],
    validate: {
        validator: async function(project_id) {
            const count = await this.model('Project').count({ _id: project_id }).exec();
            return count;
        },
        message: props => `${props.value} Invalid project ID. User doesn't exist by this ID.`
    },
  },
  designation: { 
    type: String,
    required: true,
    max: 30,
    enum: [...PROJECT_MEMBERS_DESIGNATIONS]
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true],
    validate: {
        validator: async function(created_by) {
            const count = await this.model('User').count({ _id: created_by }).exec();
            return count;
        },
        message: props => `"${props.value}" Invalid created by ID. User doesn't exist by this ID.`
    },
  },
  is_active: {
    type: Boolean,
    default: false
  },
  invitation_accepted: {
    type: Boolean,
    default: false
  },
  invite_email_sent: {
    type: Boolean,
    default: false
  },
  timestamps: {
    createdAt: 'created_at', // Use `created_at` to store the created date
    updatedAt: 'updated_at', // and `updated_at` to store the last updated date,
    type: Date,
    default: Date.now(0)
  }
});

ProjectMemberSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ProjectMemberSchema.set('toJSON', {
  virtuals: true,
});


const ProjectMemberModel = mongoose.model('ProjectMember', ProjectMemberSchema);
export default ProjectMemberModel