import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { TokenDto } from './dto/token.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/public-key')
  getPublicKey(): Promise<string> {
    return this.userService.getPublicKey();
  }

  @Post('/signup')
  signUpUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.signUpUser(createUserDto);
  }

  @Post('/login')
  loginUser(@Body() getUserDto: CreateUserDto): Promise<string> {
    return this.userService.loginUser(getUserDto);
  }

  @Post('/verify')
  verifyUser(@Body() tokenDto: TokenDto): Promise<JwtPayload> {
    return this.userService.verifyUser(tokenDto);
  }

  // @Put(':id')
  // updateUser(){}

  // @Delete()
}
