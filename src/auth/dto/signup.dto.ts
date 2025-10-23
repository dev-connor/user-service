import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, isEmail, IsNotEmpty, IsString } from "class-validator"

export class SignUpRequest {
  @ApiProperty({
    example: "protopie123@gmail.com",
    description: "이메일",
  })
  @IsEmail()
  email: string

  @ApiProperty({
    example: "password123",
    description: "비밀번호",
  })
  @IsString()
  password: string

  @ApiProperty({
    example: "프로토파이",
    description: "이름",
  })
  @IsString()
  name: string
}
