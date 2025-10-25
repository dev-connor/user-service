import { Module, forwardRef } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { JwtModule } from "@nestjs/jwt"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "../user/entities/User"
import { ACCESS_TOKEN_EXPIRE_IN, JWT_SECRET } from "./constants"
import { RefreshToken } from "./entities/RefreshToken"
import { UserModule } from "../user/user.module"

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET.secret,
      signOptions: { expiresIn: ACCESS_TOKEN_EXPIRE_IN },
    }),
    TypeOrmModule.forFeature([RefreshToken]),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], 
})
export class AuthModule {}
