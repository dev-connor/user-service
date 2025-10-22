import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../entities/User";

export class UserMapper {
  static toEntity(dto: CreateUserDto): User {
    const user = new User()
    user.email = dto.email
    user.passwordHash = dto.password
    user.name = dto.name
    return user
  }
}