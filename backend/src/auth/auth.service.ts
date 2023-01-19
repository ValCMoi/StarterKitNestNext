import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import * as argon2 from 'argon2'
import { CreateUserDto } from 'src/user/dto/create-user.dto';
const crypt = require('../../utils/crypt/cryptDecrypt.js')

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
    ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
 
    if (user && user.password === crypt.encrypt(password)) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async hashData(data: string) {
    return await argon2.hash(data);
  }


  async login(user: User) {
    const tokens = await this.getTokens(user)
    return {
      tokens
    };
  }

  async logout(userId: string){
    console.log("UserId : ", userId)
    let userUpdated = await this.usersService.findOne(userId)
    userUpdated.refreshToken = null
    return this.usersService.update(userId, userUpdated)
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(user: User) {
    const payload = { id:user.id, email: user.email, role: user.role};
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        payload,
        {
          secret: process.env.SECRET_KEY,
          expiresIn: process.env.JWT_LIFE_DURATION,
        },
      ),
      this.jwtService.signAsync(
        payload,
        {
          secret: process.env.SECRET_KEY_JWT,
          expiresIn: process.env.JWT_REFRESH_LIFE_DURATION,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };

  }

}