import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  user: mongoose.Schema.Types.ObjectId;
  extractedText: string;
  extractedSkills: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    extractedText: {
      type: String,
      required: true,
    },
    extractedSkills: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model<IResume>('Resume', ResumeSchema);

export default Resume;