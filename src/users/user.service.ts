import { Injectable, BadRequestException } from '@nestjs/common';
import { readFileSync } from 'fs';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { TokenDto } from './dto/token.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

const publicKey = readFileSync('./keys/public.key', 'utf8');
const privateKey = readFileSync('./keys/private.key', 'utf8');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async getPublicKey(): Promise<string> {
    return publicKey;
  }

  async signUpUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      username: createUserDto.username,
    });

    if (!createUserDto.username || !createUserDto.password) {
      throw new BadRequestException({
        success: false,
        message: `Please fill all fields`,
      });
    }

    if (user) {
      throw new BadRequestException({
        success: false,
        message: `User already exists.`,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    const newUser = new User();

    newUser.username = createUserDto.username;
    newUser.passwordHash = passwordHash;

    await this.userRepository.save(newUser);

    const access_token = jwt.sign({ id: newUser.id }, privateKey, {
      algorithm: 'RS256',
    });
    console.log(access_token);
    return newUser;
  }

  async loginUser(getUserDto: CreateUserDto): Promise<string> {
    const user = await this.userRepository.findOne({
      username: getUserDto.username,
    });

    if (!user) {
      throw new BadRequestException({
        success: false,
        message: `User doesn't exists.`,
      });
    }

    const validPassword = await bcrypt.compare(
      getUserDto.password,
      user.passwordHash
    );
    if (!validPassword) {
      throw new BadRequestException({
        success: false,
        message: `Invalid password`,
      });
    }

    const access_token = jwt.sign({ id: user.id }, privateKey, {
      algorithm: 'RS256',
    });

    return access_token;
  }

  async verifyUser(tokenDto: TokenDto): Promise<JwtPayload> {
    const token = tokenDto.access_token;

    try {
      return jwt.verify(token, publicKey) as JwtPayload;
    } catch {
      throw new BadRequestException({
        success: false,
        message: `Invalid token`,
      });
    }
  }

  // async updateUser(){}

  // async deleteUser(){}
}
