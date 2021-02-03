import { Entity, BaseEntity, Column, ObjectIdColumn, ObjectID } from "typeorm";
import { Date } from "../models/Date";
import { Index } from "../models/Index";
import { PPT } from "../models/PPT";
import { ObjectType, Field, InputType } from "type-graphql";
import { Page } from "./Page";

@Entity()
@ObjectType()
@InputType("EntryInput")
export class Entry extends BaseEntity {
  @Field(() => String, { nullable: true })
  @ObjectIdColumn()
  _id: ObjectID;

  @Field(() => String, { nullable: true })
  @Column()
  boxID: string;

  @Field(() => Page, { nullable: true })
  @Column()
  page: Page;

  @Field(() => String, { nullable: true })
  @Column()
  book: string;

  @Field(() => String, { nullable: true })
  @Column()
  header: string;

  @Field(() => String, { nullable: true })
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
