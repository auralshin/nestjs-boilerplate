import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { AppLoggerService } from '../applogger/applogger.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @Inject(AppLoggerService) private appLoggerService: AppLoggerService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const newUser = await this.userModel.create(createUserDto);
    await newUser.save();
    this.appLoggerService.log(
      `Path: ${
        UserService.name
      } | Timestamp: ${new Date().toISOString()} | Function-Name: create | Message: Created new user successfully`,
    );
    return newUser;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(String(id), updateUserDto, { new: true })
      .exec();
    this.appLoggerService.log(
      `Path: ${
        UserService.name
      } | Timestamp: ${new Date().toISOString()} | Function-Name: update | Message: Updated user ${
        user.firstName
      } successfully`,
    );
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
