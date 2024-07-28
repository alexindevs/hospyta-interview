import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(user: RegisterDto) {
    const userExists = await this.userService.findUserByEmail(user.email);
    if (userExists) {
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const newUser = await this.userService.createUser({
      ...user,
      password: hashedPassword,
    });
    const token = this.generateJwtToken(newUser);
    return {
      code: 201,
      message: 'User created successfully',
      data: newUser,
      token,
    };
  }

  async login(user: LoginDto) {
    const validUser = await this.validateUser(user.email, user.password);
    if (!validUser) {
      throw new BadRequestException('Invalid credentials');
    }
    const token = this.generateJwtToken(validUser);
    return {
      code: 200,
      message: 'Login successful',
      data: validUser,
      token,
    };
  }

  private generateJwtToken(user: any): string {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }
}
