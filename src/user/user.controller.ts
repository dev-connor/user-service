import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from "@nestjs/common"
import { UserService } from "./user.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { ApiOperation } from "@nestjs/swagger"

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/signup")
  @ApiOperation({ summary: "사용자 가입 (이메일, 비밀번호 등 필수 정보 저장)" })
  async signup(@Body() createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto) 
    return "ok"
  }
  @Post("/signin")
  @ApiOperation({
    summary:
      "사용자 로그인 (이메일, 비밀번호로 인증 후 토큰 발급 또는 세션 관리)",
  })
  async signin(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Delete("/users/:userId")
  @ApiOperation({ summary: "특정 사용자 정보 삭제 (탈퇴)" })
  async remove(@Param("userId") userId: string) {
    return this.userService.remove(userId)
  }

  @Put("/users/:userId")
  @ApiOperation({ summary: "특정 사용자 정보 변경 (email, name, etc)" })
  async update() {}

  @Get("/users/:userId")
  @ApiOperation({ summary: "특정 사용자 정보 조회" })
  async findAll() {
    return this.userService.findAll()
  }

  @Get("/users")
  @ApiOperation({
    summary: "모든 사용자 정보 조회 (Admin 만 사용 가능, 페이징 처리 필요)",
  })
  async findOne(@Param("id") id: string) {
    return this.userService.findOne(id)
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }
}
