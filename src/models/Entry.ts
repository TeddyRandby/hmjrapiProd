import { Entity, BaseEntity, Column, ObjectIdColumn, ObjectID } from "typeorm";
import { Date } from "../models/Date";
import { Index } from "../models/Index";
import { PPT } from "../models/PPT";
import { ObjectType, Field, InputType } from "type-graphql";

@Entity()
@ObjectType()
@InputType("EntryInput")
export class Entry extends BaseEntity {
  @Field(() => String, { nullable: true })
  @ObjectIdColumn()
  _id: ObjectID;

  @Field(() => String, { nullable: true })
  @Column({default: ""})
  boxID: string;

  @Field(() => String, { nullable: true })
  @Column({default: ""})
  book: string;

  @Field(() => String, { nullable: true })
  @Column({default: ""})
  header: string;

  @Field(() => String, { nullable: true })
  @Column({default: ""})
  content: string;

  @Field(() => [Date], { nullable: true })
  @Column({default: []})
  dates: Date[];

  @Field(() => [Index], { nullable: true })
  @Column({default: []})
  indexes: Index[];

  @Field(() => [PPT], { nullable: true })
  @Column({default: []})
  entities: PPT[];

  @Field(() => Date, { nullable: true })
  @Column()
  minDate: Date;

  @Field(() => Date, { nullable: true })
  @Column()
  maxDate: Date;
}
