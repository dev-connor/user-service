import { PartialType } from "@nestjs/mapped-types"
import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"

export class UpdateUserRequest {
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
