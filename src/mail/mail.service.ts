import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationEmail(
    username: string,
    confirmationCode: string,
    to: string,
  ) {
    return await this.mailerService.sendMail({
      to: to,
      subject: 'Testing Nest Mailermodule with template ✔',
      template: 'confirmation',
      context: {
        confirmationCode,
        username: username,
      },
    })
  }
}
