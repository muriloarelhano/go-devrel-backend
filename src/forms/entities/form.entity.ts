import { Column, CreateDateColumn, Entity, Index, ObjectID, ObjectIdColumn } from "typeorm";
import { Question } from "./question.entity";

@Entity()
export class Form {
  @ObjectIdColumn()
  id: ObjectID;

  @Index('user_id_index')
  @Column()
  userId: string;

  @Column()
  stage: string;

  @Column()
  formIdentifier: string;

  @Column((type) => Question)
  responses: Question[];

  @Index('created_at_index')
  @CreateDateColumn()
  createdAt: Date
}
