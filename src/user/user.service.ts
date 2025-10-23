import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common"
import { UpdateUserRequest } from "./dto/update-user.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { UserMapper } from "./mapper/user.mapper"
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt"
import { User } from "./entities/User"
import { GetUserDetailResponse, GetUserListQuery } from "./dto/get-user.dto"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(query: GetUserListQuery) {
    const page = query.page 
    const limit = query.limit 

    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
    })

    return {
      total,
      page,
      limit,
      data: users.map((user) => UserMapper.toDtos(user)),
    }
  }

  async findOneById(userId: string): Promise<GetUserDetailResponse> {
    const user = await this.userRepository.findOneBy({ id: userId })
    return UserMapper.toDto(user)
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email })
    return user
  }

  async save(user: User) {
    await this.userRepository.save(user)
  }

  async update(userId: string, updateUserDto: UpdateUserRequest) {
    const entity = await this.userRepository.findOneBy({ id: userId })
    if (entity === null) {
      throw new NotFoundException(`User(${userId}) not found`)
    }
    entity.email = updateUserDto.email
    entity.passwordHash = updateUserDto.password
    entity.name = updateUserDto.name
    await this.userRepository.save(entity)
    return `This action updates a #${userId} user`
  }

  async remove(userId: string) {
    await this.userRepository.delete(userId)
    return `This action removes a #${userId} user`
  }
}
