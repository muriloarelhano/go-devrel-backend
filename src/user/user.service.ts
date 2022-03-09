import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import * as bcrypt from 'bcrypt'
import { ERROR_INVALID_CREDENTIALS, ERROR_USER_NOT_FOUND } from 'src/constants'
import { use } from 'passport'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 8)
    return this.userRepository.save(createUserDto)
  }

  findOne(email: string) {
    return this.userRepository.findOne({ where: { email: email } })
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto)
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne(id)
    return await this.userRepository.remove(user)
  }

  async resetPassword(id: string, password: string, newPassword: string) {
    const user = await this.userRepository.findOne(id)
    if (!user) throw new NotFoundException(ERROR_USER_NOT_FOUND)
    if (!bcrypt.compareSync(password, user.password))
      throw new BadRequestException(ERROR_INVALID_CREDENTIALS)
    return this.userRepository.update(id, {
      password: bcrypt.hashSync(newPassword, 8),
    })
  }
}
