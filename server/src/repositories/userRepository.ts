import { Types, FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import { User, type IUser } from "../models/User.js";
import { type UserRole } from "../config/constants.js";

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  avatar?: string;
}

export interface UpdateUserData {
  name?: string;
  avatar?: string;
  isActive?: boolean;
  lastLoginAt?: Date;
}

export interface UserFilter {
  role?: UserRole;
  isActive?: boolean;
  search?: string;
}

export class UserRepository {
  async create(data: CreateUserData): Promise<IUser> {
    const user = new User(data);
    return user.save();
  }

  async findById(id: string | Types.ObjectId): Promise<IUser | null> {
    return User.findById(id);
  }

  async findByIdWithPassword(
    id: string | Types.ObjectId,
  ): Promise<IUser | null> {
    return User.findById(id).select("+password");
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findByEmail(email);
  }

  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() }).select("+password");
  }

  async findAll(filter: UserFilter = {}): Promise<IUser[]> {
    const query: FilterQuery<IUser> = {};

    if (filter.role) query.role = filter.role;
    if (filter.isActive !== undefined) query.isActive = filter.isActive;
    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: "i" } },
        { email: { $regex: filter.search, $options: "i" } },
      ];
    }

    return User.find(query).sort({ createdAt: -1 });
  }

  async update(
    id: string | Types.ObjectId,
    data: UpdateUserData,
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true },
    );
  }

  async updateLastLogin(id: string | Types.ObjectId): Promise<void> {
    await User.findByIdAndUpdate(id, { $set: { lastLoginAt: new Date() } });
  }

  async delete(id: string | Types.ObjectId): Promise<IUser | null> {
    return User.findByIdAndDelete(id);
  }

  async count(filter: UserFilter = {}): Promise<number> {
    const query: FilterQuery<IUser> = {};

    if (filter.role) query.role = filter.role;
    if (filter.isActive !== undefined) query.isActive = filter.isActive;

    return User.countDocuments(query);
  }

  async exists(email: string): Promise<boolean> {
    const user = await User.findOne({ email: email.toLowerCase() });
    return !!user;
  }
}

export const userRepository = new UserRepository();
