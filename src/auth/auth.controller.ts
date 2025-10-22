import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { ApiOperation } from "@nestjs/swagger"
import { SignUpDto } from "./dto/signup.dto"
import { SignInDto } from "./dto/signin.dto"

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  @ApiOperation({ summary: "사용자 가입 (이메일, 비밀번호 등 필수 정보 저장)" })
  async signup(@Body() requestBody: SignUpDto) {
    return await this.authService.signUp(requestBody)
  }
  @Post("/signin")
  @ApiOperation({
    summary:
      "사용자 로그인 (이메일, 비밀번호로 인증 후 토큰 발급 또는 세션 관리)",
  })
  async signin(@Body() requestBody: SignInDto) {
    return this.authService.signIn(requestBody.email, requestBody.password)
  }
}
