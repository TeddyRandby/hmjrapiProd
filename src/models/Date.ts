import { Entity, BaseEntity, Column, PrimaryColumn } from "typeorm";
import { ObjectType, Field, InputType } from "type-graphql";

@Entity()
@ObjectType()
@InputType("GQLDate")
export class Date extends BaseEntity {
  @Column()
  day: number;

  @Column()
  month: number;

  @Column()
  year: number;

  @Field(() => String)
  @PrimaryColumn()
  stringified: string;

  @Field(() => String, { nullable: true })
  @Column()
  content: string;
}
