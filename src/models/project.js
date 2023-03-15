import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: {
    type: String,
    max: 70,
    required: [true],
    unique: true,
    validate: {
        validator: async function(name) {
            const count = await this.model('Project').count({ name }).exec();
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
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true],
    validate: {
        validator: async function(created_by) {
            const count = await this.model('User').count({ _id: created_by }).exec();
            console.log("hfhjsfhjsdfhjsdfhjsdfhjsdhjfshdjfhsdjf", count);
            return !count;
        },
        message: props => `"${props.value}" Invalid created by ID. User doesn't exist by this ID.`
    },
  },
  timestamps: {
    createdAt: 'created_at', // Use `created_at` to store the created date
    updatedAt: 'updated_at', // and `updated_at` to store the last updated date,
    type: Date,
    default: Date.now(0)
  }
});


ProjectSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ProjectSchema.set('toJSON', {
  virtuals: true,
});


const ProjectModel = mongoose.model('Project', ProjectSchema);
export default ProjectModel