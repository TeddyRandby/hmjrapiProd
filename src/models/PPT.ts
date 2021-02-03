import { Entity, BaseEntity, PrimaryColumn } from "typeorm";
import { ObjectType, Field, InputType } from "type-graphql";

@Entity()
@ObjectType()
@InputType("EntityInput")
export class PPT extends BaseEntity {
  @Field(() => String)
  @PrimaryColumn()
  name: String;
}
