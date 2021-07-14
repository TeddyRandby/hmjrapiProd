import {Field, InputType, ObjectType} from "type-graphql";
import {BaseEntity, Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
@ObjectType()
@InputType("IndexInput")
export class Index extends BaseEntity {
  @Field({nullable : true}) @Column() content: string;

  @PrimaryColumn() stringified: string;

  @Field({nullable : true}) @Column() book: string;

  @Field({nullable : true}) @Column() page: string;
}
