import { Entity, BaseEntity, Column, ObjectIdColumn, ObjectID } from "typeorm";
import { Date } from "./Date";
import { Index } from "./Index";
import { PPT } from "./PPT";
import { ObjectType, Field } from "type-graphql";

@Entity()
@ObjectType()
export class Entry extends BaseEntity {
  @Field(() => String)
  @ObjectIdColumn()
  _id: ObjectID;

  @Field(() => String)
  @Column()
  boxID: string;

  @Field(() => String)
  @Column()
  book: string;

  @Field(() => String)
  @Column()
  header: string;

  @Field(() => String)
  @Column()
  content: string;

  @Field(() => [Date])
  @Column()
  dates: [Date];

  @Field(() => [Index])
  @Column()
  indexes: [Index];

  @Field(() => [PPT])
  @Column()
  entities: [PPT];

  @Field(() => Date)
  @Column()
  minDate: Date;

  @Field(() => Date)
  @Column()
  maxDate: Date;
}
