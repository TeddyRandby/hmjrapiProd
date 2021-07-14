import {Field, InputType, ObjectType} from "type-graphql";
import {BaseEntity, Column, Entity, ObjectID, ObjectIdColumn} from "typeorm";
import {Date} from "../models/Date";
import {Index} from "../models/Index";

export type Tag = "refugee"|"holocaust";

@Entity()
@ObjectType()
@InputType("EntryInput")
export class Entry extends BaseEntity {
  @Field(_ => String, {nullable : true}) @ObjectIdColumn() _id: ObjectID;

  @Column({default : ""}) mostRecentAuthor: string;

  @Field({nullable : true}) @Column({default : ""}) boxID: string;

  @Field({nullable : true}) @Column({default : ""}) book: string;

  @Field({nullable : true}) @Column({default : ""}) header: string;

  @Field({nullable : true}) @Column({default : ""}) content: string;

  @Field(_ => [Date], {nullable : true}) @Column({default : []}) dates: Date[];

  @Field(_ => [Index], {nullable : true})
  @Column({default : []})
  indexes: Index[];

  @Field(_ => [String], {nullable : true})
  @Column({default : []})
  people: string[];

  @Field(_ => [String], {nullable : true})
  @Column({default : []})
  locations: string[];

  @Field(_ => [String], {nullable : true})
  @Column({default : []})
  organizations: string[];

  @Field(_ => [String], {nullable : true}) @Column({default : []}) tags: Tag[];

  @Field({nullable : true}) @Column() minDate: Date;

  @Field({nullable : true}) @Column() maxDate: Date;
}
