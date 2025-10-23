import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
} from "@nestjs/common"
import { UserService } from "./user.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { ApiOperation, ApiParam } from "@nestjs/swagger"
import { SigninUserDto } from "./dto/signin-user.dto"
import { OwnershipGuard } from "../auth/auth.guard"
import { Roles } from "../auth/auth.decorator"

@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiParam({
    name: "userId",
    format: "uuid",
  })
  @Delete("/:userId")
  @UseGuards(OwnershipGuard)
  @ApiOperation({ summary: "특정 사용자 정보 삭제 (탈퇴)" })
  async remove(@Param("userId") userId: string) {
    return this.userService.remove(userId)
  }

  @ApiParam({
    name: "userId",
    format: "uuid",
  })
  @Put("/:userId")
  @UseGuards(OwnershipGuard)
  @ApiOperation({ summary: "특정 사용자 정보 변경 (email, name, etc)" })
  async update(
    @Param("userId") userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.update(userId, updateUserDto)
  }

  @ApiParam({
    name: "userId",
    format: "uuid",
  })
  @Get("/:userId")
  @UseGuards(OwnershipGuard)
  @ApiOperation({ summary: "특정 사용자 정보 조회" })
  async findOne(@Param("userId") userId: string) {
    return this.userService.findAll()
  }

  @Get()
  @Roles(["admin"])
  @UseGuards(OwnershipGuard)
  @ApiOperation({
    summary: "모든 사용자 정보 조회 (Admin 만 사용 가능, 페이징 처리 필요)",
  })
  async findAll() {
    return await this.userService.findAll()
  }
}
