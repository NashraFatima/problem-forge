import mongoose, { Schema, Document, Model, Types } from "mongoose";
import {
  TRACKS,
  SOFTWARE_CATEGORIES,
  HARDWARE_CATEGORIES,
  INDUSTRIES,
  DIFFICULTY_LEVELS,
  PROBLEM_STATUSES,
  type Track,
  type Industry,
  type DifficultyLevel,
  type ProblemStatus,
} from "../config/constants.js";

export interface IProblemStatement extends Document {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;

  title: string;
  description: string;
  track: Track;
  category: string;
  industry: Industry;

  expectedOutcome: string;
  techStack: string[];
  difficulty: DifficultyLevel;

  datasets?: string;
  apiLinks?: string;
  referenceLinks: string[];

  ndaRequired: boolean;
  mentorsProvided: boolean;

  status: ProblemStatus;
  adminNotes?: string;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  featured: boolean;

  contactPerson: string;
  contactEmail: string;

  createdAt: Date;
  updatedAt: Date;
}

interface IProblemStatementModel extends Model<IProblemStatement> {
  findApproved(): Promise<IProblemStatement[]>;
  findByOrganization(
    orgId: Types.ObjectId | string,
  ): Promise<IProblemStatement[]>;
  findPending(): Promise<IProblemStatement[]>;
  findFeatured(): Promise<IProblemStatement[]>;
  findRecent(limit?: number): Promise<IProblemStatement[]>;
}

const ALL_CATEGORIES = [...SOFTWARE_CATEGORIES, ...HARDWARE_CATEGORIES];

const problemStatementSchema = new Schema<
  IProblemStatement,
  IProblemStatementModel
>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization ID is required"],
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    track: {
      type: String,
      enum: TRACKS,
      required: [true, "Track is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      validate: {
        validator: function (v: string) {
          return ALL_CATEGORIES.includes(v as any);
        },
        message: "Invalid category for the selected track",
      },
    },
    industry: {
      type: String,
      enum: INDUSTRIES,
      required: [true, "Industry is required"],
    },

    expectedOutcome: {
      type: String,
      required: [true, "Expected outcome is required"],
      maxlength: [2000, "Expected outcome cannot exceed 2000 characters"],
    },
    techStack: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      enum: DIFFICULTY_LEVELS,
      required: [true, "Difficulty level is required"],
    },

    datasets: {
      type: String,
      maxlength: [1000, "Datasets info cannot exceed 1000 characters"],
    },
    apiLinks: {
      type: String,
      maxlength: [1000, "API links cannot exceed 1000 characters"],
    },
    referenceLinks: {
      type: [String],
      default: [],
    },

    ndaRequired: {
      type: Boolean,
      default: false,
    },
    mentorsProvided: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: PROBLEM_STATUSES,
      default: "pending",
    },
    adminNotes: {
      type: String,
      maxlength: [1000, "Admin notes cannot exceed 1000 characters"],
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    featured: {
      type: Boolean,
      default: false,
    },

    contactPerson: {
      type: String,
      required: [true, "Contact person is required"],
      trim: true,
    },
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        const obj = ret as Record<string, unknown>;
        delete obj.__v;
        obj.id = obj._id?.toString();
        return obj;
      },
    },
    toObject: {
      virtuals: true,
    },
  },
);

problemStatementSchema.index({ organizationId: 1 });
problemStatementSchema.index({ status: 1 });
problemStatementSchema.index({ track: 1 });
problemStatementSchema.index({ category: 1 });
problemStatementSchema.index({ difficulty: 1 });
problemStatementSchema.index({ featured: 1 });
problemStatementSchema.index({ createdAt: -1 });
problemStatementSchema.index({ title: "text", description: "text" });

problemStatementSchema.virtual("organization", {
  ref: "Organization",
  localField: "organizationId",
  foreignField: "_id",
  justOne: true,
});

problemStatementSchema.statics.findApproved = function () {
  return this.find({ status: "approved" })
    .populate("organization")
    .sort({ createdAt: -1 });
};

problemStatementSchema.statics.findByOrganization = function (
  orgId: Types.ObjectId | string,
) {
  return this.find({ organizationId: orgId }).sort({ createdAt: -1 });
};

problemStatementSchema.statics.findPending = function () {
  return this.find({ status: "pending" })
    .populate("organization")
    .sort({ createdAt: 1 });
};

problemStatementSchema.statics.findFeatured = function () {
  return this.find({ status: "approved", featured: true })
    .populate("organization")
    .sort({ createdAt: -1 });
};

problemStatementSchema.statics.findRecent = function (limit = 6) {
  return this.find({ status: "approved" })
    .populate("organization")
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const ProblemStatement = mongoose.model<
  IProblemStatement,
  IProblemStatementModel
>("ProblemStatement", problemStatementSchema);
