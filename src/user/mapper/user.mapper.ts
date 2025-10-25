import { SignUpRequest } from "../../auth/dto/signup.dto"
import { GetUserDetailResponse, GetUserListResponse } from "../dto/get-user.dto"
import { User } from "../entities/User"

export class UserMapper {
  static toEntity(dto: SignUpRequest): User {
    const entity = new User()
    entity.email = dto.email
    entity.passwordHash = dto.password
    entity.name = dto.name
    return entity
  }

  static toDto(entity: User): GetUserDetailResponse {
    const dto = new GetUserDetailResponse()
    dto.email = entity.email
    dto.name = entity.name
    dto.createdAt = entity.createdAt
    dto.updatedAt = entity.updatedAt
    return dto
  }
  static toDtos(entity: User): GetUserListResponse {
    const dto = new GetUserListResponse()
    dto.id = entity.id
    dto.email = entity.email
    dto.name = entity.name
    dto.createdAt = entity.createdAt
    dto.updatedAt = entity.updatedAt
    return dto
  }
}
