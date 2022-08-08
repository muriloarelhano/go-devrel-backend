import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { ERROR_INVALID_CREDENTIALS, ERROR_USER_NOT_FOUND, POSTGRES_CONNECTION } from 'src/constants'
import { MailService } from 'src/mail/mail.service'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, POSTGRES_CONNECTION)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 8)
    const createdUser = await this.userRepository.save(createUserDto)
    const emailResponse = await this.mailService.sendConfirmationEmail(
      createdUser,
      this.jwtService.sign(
        { sub: createdUser.id, email: createdUser.email },
        {
          expiresIn: '2d',
        },
      ),
    )
    return { user: createdUser, confirmation_email: emailResponse }
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
