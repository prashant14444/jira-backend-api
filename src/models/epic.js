import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const EpicSchema = new Schema({
  title: {
    type: String,
    max: 70,
    required: [true],
    unique: true,
    validate: {
        validator: async function(name) {
            const count = await this.model('Epic').count({ name }).exec();
            return !count;
        },
        message: props => `"${props.value}" name is Already in use, please use different name`
    },
  },
  description: {
    type: String,
  },
  due_date: { 
    type: Date,
    default: null
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true],
    validate: {
        validator: async function(project_id) {
            const doesExist = await this.model('Project').count({ _id: project_id }).exec();
            return doesExist;
        },
        message: props => `"${props.value}" Invalid project ID. Project doesn't exist by this ID.`
    },
  },

// created by is referred from the project member model because only a project member can create of edit the Epic
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectMember',
    required: [true],
    validate: {
        validator: async function(created_by) {
            const doesExist = await this.model('ProjectMember').count({ _id: created_by }).exec();
            return doesExist;
        },
        message: props => `"${props.value}" Invalid created by ID. ProjectMember doesn't exist by this ID.`
    },
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
  timestamps: {
    createdAt: 'created_at', // Use `created_at` to store the created date
    updatedAt: 'updated_at', // and `updated_at` to store the last updated date,
    type: Date,
    default: Date.now(0)
  }
});


EpicSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

EpicSchema.set('toJSON', {
  virtuals: true,
});


const EpicModel = mongoose.model('Epic', EpicSchema);
export default EpicModel