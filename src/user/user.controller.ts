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
  Query,
} from "@nestjs/common"
import { UserService } from "./user.service"
import { UpdateUserRequest } from "./dto/update-user.dto"
import { ApiOkResponse, ApiOperation, ApiParam } from "@nestjs/swagger"
import { OwnershipGuard } from "../auth/auth.guard"
import { Roles } from "../auth/auth.decorator"
import {
  GetUserDetailResponse,
  GetUserListQuery as GetUserListQuery,
} from "./dto/get-user.dto"

@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/:userId")
  @ApiParam({
    name: "userId",
    format: "uuid",
  })
  @UseGuards(OwnershipGuard)
  @ApiOkResponse({ type: GetUserDetailResponse })
  @ApiOperation({ summary: "특정 사용자 정보 조회" })
  async findOne(
    @Param("userId") userId: string,
  ): Promise<GetUserDetailResponse> {
    return await this.userService.findOneById(userId)
  }

  @Get()
  @Roles(["admin"])
  @UseGuards(OwnershipGuard)
  @ApiOperation({
    summary: "모든 사용자 정보 조회 (Admin 만 사용 가능, 페이징 처리 필요)",
  })
  async findAll(@Query() query: GetUserListQuery) {
    return await this.userService.findAll(query)
  }

  @Put("/:userId")
  @ApiParam({
    name: "userId",
    format: "uuid",
  })
  @UseGuards(OwnershipGuard)
  @ApiOperation({ summary: "특정 사용자 정보 변경 (email, name, etc)" })
  async update(
    @Param("userId") userId: string,
    @Body() updateUserDto: UpdateUserRequest,
  ) {
    await this.userService.update(userId, updateUserDto)
  }

  @Delete("/:userId")
  @ApiParam({
    name: "userId",
    format: "uuid",
  })
  @UseGuards(OwnershipGuard)
  @ApiOperation({ summary: "특정 사용자 정보 삭제 (탈퇴)" })
  async remove(@Param("userId") userId: string) {
    return this.userService.remove(userId)
  }
}
