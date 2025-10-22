import { User } from "../../entities/User";
import { CreateUserDto } from "../dto/create-user.dto";

export class UserMapper {
  static toEntity(dto: CreateUserDto): User {
    const user = new User()
    user.email = dto.email
    user.passwordHash = dto.password
    user.name = dto.name
    return user
    // return new User({
    //   id: dto.id,
    //   passwordHash: dto.password, 
    //   name: dto.name, 
    //   email: dto.email, 
    // })
  }
}