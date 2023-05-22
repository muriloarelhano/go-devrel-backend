import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { stringify } from "querystring";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   *
   * @param user {User} User saved on database
   * @param token {String} Unique token to validate e-mail
   * @returns
   */
  async sendConfirmationEmail(user: User, token: string) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: "Por favor não responda esse e-mail",
        template: "confirmation",
        context: {
          confirmationCode: stringify({ token }),
          username: user.first_name,
          baseUrl: process.env.BASE_CALLBACK_URL,
        },
      });
    } catch (error: any) {
      console.log(error);
      return { status: "ERROR", message: "EMAIL_REJECTED" };
    }
    return { status: "OK", message: "EMAIL_SUCCESSFULLY_SENDED" };
  }
}
