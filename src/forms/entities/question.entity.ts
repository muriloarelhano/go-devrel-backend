import { Column } from "typeorm";

export class Question {
  @Column()
  question: string;
  @Column()
  response: string;
  @Column()
  comment?: string;

  constructor(question: string, response: string, comment: string) {
    this.question = question;
    this.response = response;
    this.comment = comment;
  }
}
