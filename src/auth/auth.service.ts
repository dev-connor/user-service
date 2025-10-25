import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import * as bcrypt from "bcrypt"
import { UserMapper } from "../user/mapper/user.mapper"
import { User } from "../user/entities/User"
import { Module, forwardRef } from "@nestjs/common"
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
    requestBody.password = await this.hash(requestBody.password)
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

      const newRefreshToken = this.generateRefreshToken()
      const newRefreshTokenHash = await this.hash(newRefreshToken)
      const optionalRefreshToken = await this.refreshTokenRepository.findOneBy({
        id: user.refreshTokenId,
      })

      const entity = RefreshTokenMapper.toUpsertEntity(
        optionalRefreshToken,
        newRefreshTokenHash,
      )
      const saved = await this.refreshTokenRepository.save(entity)

      if (!optionalRefreshToken) {
        user.refreshTokenId = saved.id
        await this.userService.save(user)
      }
      return {
        userId: user.id,
        accessToken: accessToken,
        refreshToken: newRefreshToken,
      }
    } else {
      throw new UnauthorizedException("signin failed. password invalid")
    }
  }

  generateRefreshToken(): string {
    return randomBytes(64).toString("hex")
  }

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, 10)
  }

  getRole(email: string): string {
    return email.endsWith("protopie.io") ? "admin" : "member"
  }
}
