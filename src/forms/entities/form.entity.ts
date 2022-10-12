import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectID,
  ObjectIdColumn,
} from "typeorm";
import { QuestionResponse } from "./question-response.entity";

@Entity()
export class Form {
  @ObjectIdColumn()
  _id: ObjectID;

  @Index("user_id_index")
  @Column()
  userId: string;

  @Column()
  stage: string;

  @Column()
  formIdentifier: string;

  @Column((type) => QuestionResponse)
  responses: QuestionResponse;

  @Index("created_at_index")
  @CreateDateColumn()
  createdAt: Date;

  constructor(partial: Partial<Form>) {
    Object.assign(this, partial);
  }
}
