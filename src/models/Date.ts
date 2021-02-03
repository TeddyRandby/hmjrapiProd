import { Entity, BaseEntity, Column, PrimaryColumn } from "typeorm";
import { ObjectType, Field, InputType } from "type-graphql";

@Entity("Date")
@ObjectType()
@InputType("DateInput")
export class Date extends BaseEntity {
  @Field(() => Number)
  @Column()
  day: number;

  @Field(() => Number)
  @Column()
  month: number;

  @Field(() => Number)
  @Column()
  year: number;

  @Field(() => String, { nullable: true})
  @PrimaryColumn()
  stringified: string;

  @Field(() => String, { nullable: true })
  @Column()
  content: string;
}
