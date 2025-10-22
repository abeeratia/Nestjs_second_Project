import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {
  Injectable,
  UnauthorizedException,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({ ...dto, password: hashed });
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch, password);
    if (!isMatch) {
      throw new UnauthorizedException('Wrong password');
    }

    const token = this.jwtService.sign({ id: user._id, role: user.role });
    return { token };
  }
}
