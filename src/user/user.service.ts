import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { UserMapper } from "./mapper/user.mapper"
import * as bcrypt from "bcrypt"
import { SigninUserDto } from "./dto/signin-user.dto"
import { JwtService } from "@nestjs/jwt"
import { User } from "./entities/User"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(requestBody: CreateUserDto) {
    requestBody.password = await bcrypt.hash(requestBody.password, 10)
    await this.userRepository.save(UserMapper.toEntity(requestBody))
    return "This action adds a new user"
  }

  async findAll() {
    const users = await this.userRepository.find()
    return users
  }

  async findOne(userId: string) {
    // return await this.userRepository.findOneBy({ userId });
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
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
