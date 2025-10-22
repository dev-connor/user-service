import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import * as bcrypt from "bcrypt"
import { SignUpDto } from "./dto/signup.dto"
import { UserMapper } from "../user/mapper/user.mapper"
import { User } from "../user/entities/User"
import { randomBytes } from 'crypto';
import { RefreshToken } from "./entities/RefreshToken"
import { RefreshTokenMapper } from "./mapper/refreshToken.mapper"
import * as ms from 'ms';
import { REFRESH_TOKEN_EXPIRE_IN } from "./constants"


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async signUp(requestBody: SignUpDto) {
    requestBody.password = await bcrypt.hash(requestBody.password, 10)
    await this.userRepository.save(UserMapper.toEntity(requestBody))
    return "This action adds a new user"
  }

  async signIn(email: string, password: string) {
    const user = await this.userRepository.findOneBy({
      email: email,
    })
    if (user === null) {
      throw new UnauthorizedException(
        `signin failed. Email(${email}) not found`,
      )
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash)
    if (passwordMatch) {
      const payload = {sub: user.id, role: "member"}
      const accessToken = await this.jwtService.signAsync(payload) 
      const refreshToken = this.generateRefreshToken()
      const refreshTokenEntity = await this.refreshTokenRepository.save(RefreshTokenMapper.toEntity(await bcrypt.hash(refreshToken, 10), new Date(Date.now() + ms(REFRESH_TOKEN_EXPIRE_IN))))
      user.refreshTokenId = refreshTokenEntity.id
      await this.userRepository.save(user)
      
      return {
        accessToken: accessToken,
        refreshToken: refreshToken, 
      }
    } else {
      throw new UnauthorizedException("signin failed. password invalid")
    }
  }

  generateRefreshToken(): string {
    return randomBytes(64).toString("hex")
  }
}
