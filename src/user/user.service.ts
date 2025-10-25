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
    const user = await this.userRepository.findOneBy({ id: userId })
    if (user === null) {
      throw new NotFoundException(`User(${userId}) not found`)
    }
    user.email = updateUserDto.email
    user.passwordHash = updateUserDto.password
    user.name = updateUserDto.name
    await this.userRepository.save(user)
    return `This action updates a #${userId} user`
  }

  async remove(userId: string) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId })
      if (!user) {
        throw new NotFoundException(`User(${userId}) not found`)
      }

      console.log(`RabbitMQ 로 ${userId} 삭제 메시지 발행`)
      console.log(`메시지 발행 실패 시 throw 하여 롤백`)

      user.deletedAt = new Date()
      await this.userRepository.save(user)

      console.log(`transaction commit`)
      console.log(`(비동기) worker service - message consume`);
      console.log(`(비동기) worker service - worker DB 로 부터 S3 파일경로 조회`);
      console.log(`(비동기) worker service - S3 로 파일삭제 요청`);
      console.log(`(비동기) worker service - 이메일 발송`);
      
      return "ok"
    } catch (err) {
      console.error("transaction failed. rollbacked")
      throw err
    } finally {
      console.log("resource 정리")
    }
  }
}
