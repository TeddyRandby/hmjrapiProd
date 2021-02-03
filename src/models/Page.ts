import { Entity, Column, ObjectIdColumn, ObjectID, BaseEntity } from "typeorm";
import { ObjectType, Field, InputType } from "type-graphql";

@Entity()
@ObjectType()
@InputType("PageInput")
export class Page extends BaseEntity {
  @Field(() => String)
  @ObjectIdColumn()
  _id: ObjectID;

  @Field(() => String)
  @Column()
  boxID: string;

  @Field(() => [String])
  @Column()
  entries: ObjectID[];
}
