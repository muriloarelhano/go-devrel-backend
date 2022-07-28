import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { Question } from "./question.entity";

@Entity()
export class Form {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  userId: string;

  @Column()
  stage: string;

  @Column()
  formIdentifier: string;

  @Column((type) => Question)
  responses: Question[];
}
