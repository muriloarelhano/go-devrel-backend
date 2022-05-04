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
import { MailService } from 'src/mail/mail.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 8)
    const createdUser = await this.userRepository.save(createUserDto)
    const emailResponse = await this.mailService.sendConfirmationEmail(
      createdUser,
      '123123123',
    )
    return { user: createdUser, email: emailResponse }
  }

  findOne(email: string) {
    return this.userRepository.findOne({ where: { email: email } })
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto)
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } })
    return await this.userRepository.remove(user)
  }

  async resetPassword(id: string, password: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) throw new NotFoundException(ERROR_USER_NOT_FOUND)
    if (!bcrypt.compareSync(password, user.password))
      throw new BadRequestException(ERROR_INVALID_CREDENTIALS)
    return this.userRepository.update(id, {
      password: bcrypt.hashSync(newPassword, 8),
    })
  }
}
