import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { JwtModule } from "@nestjs/jwt"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "../user/entities/User"
import { ACCESS_TOKEN_EXPIRE_IN, JWT_SECRET } from "./constants"
import { RefreshToken } from "./entities/RefreshToken"

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET.secret,
      signOptions: { expiresIn: ACCESS_TOKEN_EXPIRE_IN },
    }),
    TypeOrmModule.forFeature([User, RefreshToken]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
