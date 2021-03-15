import { Entity, BaseEntity, Column, ObjectIdColumn, ObjectID } from "typeorm";
import { Date } from "../models/Date";
import { Index } from "../models/Index";
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

  @Field(() => [String], { nullable: true })
  @Column({default: []})
  people: string[];

  @Field(() => [String], { nullable: true })
  @Column({default: []})
  locations: string[];

  @Field(() => [String], { nullable: true })
  @Column({default: []})
  organizations: string[];

  @Field(() => Date, { nullable: true })
  @Column()
  minDate: Date;

  @Field(() => Date, { nullable: true })
  @Column()
  maxDate: Date;
}
