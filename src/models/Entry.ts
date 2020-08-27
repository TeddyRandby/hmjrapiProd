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

  @Field(() => [Date], { nullable: true })
  @Column()
  dates: Date[];

  @Field(() => [Index], { nullable: true })
  @Column()
  indexes: Index[];

  @Field(() => [PPT], { nullable: true })
  @Column()
  entities: PPT[];

  @Field(() => Date, { nullable: true })
  @Column()
  minDate: Date;

  @Field(() => Date, { nullable: true })
  @Column()
  maxDate: Date;
}
