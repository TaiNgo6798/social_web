import { LoginInput } from './inputs/login.input';
import { UserInput } from './inputs/user.input';
import { User } from './interfaces/user.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: UserInput): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async login(loginInput: LoginInput): Promise<Boolean | String> {
    const user = await this.userModel.findOne({ email: loginInput.email, password: loginInput.password })
    return user ? true : "Tài khoản không tồn tại"
  }

}
