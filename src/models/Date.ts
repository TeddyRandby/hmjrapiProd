import {Field, InputType, ObjectType} from "type-graphql";
import {BaseEntity, Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
@ObjectType()
@InputType("DateInput")
export class Date extends BaseEntity {
  @Field({nullable : true}) @Column() day: number;

  @Field({nullable : true}) @Column() month: number;

  @Field({nullable : true}) @Column() year: number;

  @Field({nullable : true}) @PrimaryColumn() stringified: string;

  @Field({nullable : true}) @Column() content: string;
}
