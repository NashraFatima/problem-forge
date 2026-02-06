import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { INDUSTRIES, type Industry } from "../config/constants.js";

export interface IOrganization extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  industry: Industry;
  contactPerson: string;
  contactEmail: string;
  verified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IOrganizationModel extends Model<IOrganization> {
  findByUserId(userId: Types.ObjectId | string): Promise<IOrganization | null>;
}

const organizationSchema = new Schema<IOrganization, IOrganizationModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
      maxlength: [200, "Organization name cannot exceed 200 characters"],
    },
    logo: {
      type: String,
    },
    description: {
      type: String,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+/, "Please enter a valid URL"],
    },
    industry: {
      type: String,
      enum: INDUSTRIES,
      required: [true, "Industry is required"],
    },
    contactPerson: {
      type: String,
      required: [true, "Contact person name is required"],
      trim: true,
      maxlength: [100, "Contact person name cannot exceed 100 characters"],
    },
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Note: userId index is already created by unique: true on the field
organizationSchema.index({ name: "text" });
organizationSchema.index({ industry: 1 });
organizationSchema.index({ verified: 1 });
organizationSchema.index({ createdAt: -1 });

organizationSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

organizationSchema.virtual("problems", {
  ref: "ProblemStatement",
  localField: "_id",
  foreignField: "organizationId",
});

organizationSchema.statics.findByUserId = function (
  userId: Types.ObjectId | string,
) {
  return this.findOne({ userId });
};

export const Organization = mongoose.model<IOrganization, IOrganizationModel>(
  "Organization",
  organizationSchema,
);
