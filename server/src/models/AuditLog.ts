import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { AUDIT_ACTIONS, type AuditAction } from "../config/constants.js";

type TargetType = "problem" | "organization" | "user";

export interface IAuditLog extends Document {
  _id: Types.ObjectId;
  adminId: Types.ObjectId;
  action: AuditAction;
  targetType: TargetType;
  targetId: Types.ObjectId;
  details: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

interface IAuditLogModel extends Model<IAuditLog> {
  log(data: {
    adminId: Types.ObjectId;
    action: AuditAction;
    targetType: TargetType;
    targetId: Types.ObjectId;
    details: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<IAuditLog>;
  findByAdmin(adminId: Types.ObjectId | string): Promise<IAuditLog[]>;
  findByTarget(
    targetType: TargetType,
    targetId: Types.ObjectId | string,
  ): Promise<IAuditLog[]>;
}

const auditLogSchema = new Schema<IAuditLog, IAuditLogModel>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Admin ID is required"],
    },
    action: {
      type: String,
      enum: AUDIT_ACTIONS,
      required: [true, "Action is required"],
    },
    targetType: {
      type: String,
      enum: ["problem", "organization", "user"],
      required: [true, "Target type is required"],
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: [true, "Target ID is required"],
    },
    details: {
      type: String,
      required: [true, "Details are required"],
      maxlength: [500, "Details cannot exceed 500 characters"],
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
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

auditLogSchema.index({ adminId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ targetType: 1, targetId: 1 });
auditLogSchema.index({ createdAt: -1 });

auditLogSchema.virtual("admin", {
  ref: "User",
  localField: "adminId",
  foreignField: "_id",
  justOne: true,
});

auditLogSchema.statics.log = async function (data) {
  return this.create(data);
};

auditLogSchema.statics.findByAdmin = function (
  adminId: Types.ObjectId | string,
) {
  return this.find({ adminId }).sort({ createdAt: -1 });
};

auditLogSchema.statics.findByTarget = function (
  targetType: TargetType,
  targetId: Types.ObjectId | string,
) {
  return this.find({ targetType, targetId }).sort({ createdAt: -1 });
};

export const AuditLog = mongoose.model<IAuditLog, IAuditLogModel>(
  "AuditLog",
  auditLogSchema,
);
