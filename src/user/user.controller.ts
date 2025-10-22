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
import { ApiOperation, ApiParam } from "@nestjs/swagger"
import { SigninUserDto } from "./dto/signin-user.dto"

@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete("/:userId")
  @ApiOperation({ summary: "특정 사용자 정보 삭제 (탈퇴)" })
  async remove(@Param("userId") userId: string) {
    return this.userService.remove(userId)
  }

  @Put("/:userId")
  @ApiOperation({ summary: "특정 사용자 정보 변경 (email, name, etc)" })
  @ApiParam({
    name: "userId",
    format: "uuid",
  })
  async update(
    @Param("userId") userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.update(userId, updateUserDto)
  }

  @Get("/:userId")
  @ApiOperation({ summary: "특정 사용자 정보 조회" })
  async findAll() {
    return this.userService.findAll()
  }

  @Get()
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
