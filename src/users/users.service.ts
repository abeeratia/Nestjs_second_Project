import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './Schema/user.schema';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(data: CreateUserDto): Promise<UserDocument> {
    const user = new this.userModel(data);
    return user.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async update(id: string, data: Partial<User>): Promise<UserDocument | null> {
    if (data.password) {
      const hashedPassword: string = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }

    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id);
  }
}
