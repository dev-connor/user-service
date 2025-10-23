import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsOptional } from "class-validator"


export class GetUserListQuery {
  @IsOptional()
  page: number = 1

  @IsOptional()
  limit: number = 10 
}

export class GetUserListResponse {
  @ApiProperty({
    example: "489f9771-4bc1-47fb-b739-796fc07e617a",
    description: "사용자 ID",
  })
  id: string

  @ApiProperty({
    example: "protopie123@gmail.com",
    description: "이메일",
  })
  email: string

  @ApiProperty({
    example: "프로토파이",
    description: "이름",
  })
  name: string

  @ApiProperty({
    example: "2025-10-22T17:54:13.828Z",
    description: "계정 생성일",
  })
  createdAt: Date

  @ApiProperty({
    example: "2025-10-22T17:54:13.828Z",
    description: "계정 정보 수정일",
  })
  updatedAt: Date
}

export class GetUserDetailResponse {
  @ApiProperty({
    example: "protopie123@gmail.com",
    description: "이메일",
  })
  email: string

  @ApiProperty({
    example: "프로토파이",
    description: "이름",
  })
  name: string

  @ApiProperty({
    example: "2025-10-22T17:54:13.828Z",
    description: "계정 생성일",
  })
  createdAt: Date

  @ApiProperty({
    example: "2025-10-22T17:54:13.828Z",
    description: "계정 정보 수정일",
  })
  updatedAt: Date
}
