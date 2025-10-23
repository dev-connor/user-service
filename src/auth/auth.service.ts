import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import * as bcrypt from "bcrypt"
import { UserMapper } from "../user/mapper/user.mapper"
import { User } from "../user/entities/User"
import { randomBytes } from "crypto"
import { RefreshToken } from "./entities/RefreshToken"
import { RefreshTokenMapper } from "./mapper/refreshToken.mapper"
import * as ms from "ms"
import { REFRESH_TOKEN_EXPIRE_IN } from "./constants"
import { UserService } from "../user/user.service"
import { SignUpRequest } from "./dto/signup.dto"

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async signUp(requestBody: SignUpRequest) {
    requestBody.password = await bcrypt.hash(requestBody.password, 10)
    await this.userService.save(UserMapper.toEntity(requestBody))
    return "ok"
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email)
    if (user === null) {
      throw new UnauthorizedException(
        `signin failed. Email(${email}) not found`,
      )
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash)
    const role = this.getRole(user.email)
    if (passwordMatch) {
      const payload = { sub: user.id, role: role }
      const accessToken = await this.jwtService.signAsync(payload)
      const refreshToken = this.generateRefreshToken()
      const refreshTokenEntity = await this.refreshTokenRepository.save(
        RefreshTokenMapper.toEntity(
          await bcrypt.hash(refreshToken, 10),
          new Date(Date.now() + ms(REFRESH_TOKEN_EXPIRE_IN)),
        ),
      )
      user.refreshTokenId = refreshTokenEntity.id
      await this.userService.save(user)

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

  private getRole(email: string): string {
    return email.endsWith("protopie.io") ? "admin" : "member"
  }
}
