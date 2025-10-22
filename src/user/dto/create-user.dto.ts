import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreateUserDto {
  @ApiProperty({
    example: "protopie123@gmail.com",
    description: "이메일",
  })
  email: string 

  @ApiProperty({
    example: "password123",
    description: "비밀번호",
  })
  password: string 
  
  @ApiProperty({
    example: "프로토파이",
    description: "이름",
  })
  name: string 
  
}
